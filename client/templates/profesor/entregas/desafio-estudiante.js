export {
  VideosCapsulas
};

const { ASIGNATURAS } = require('../../../../lib/constantes');

Template.desafioestudiante.onCreated(function() {
	this.currentUpload = new ReactiveVar(false);
});

Template.desafioestudiante.helpers({
	desafio() {
		const desafio = Session.get("DesafioSeleccionado");
		if(!desafio) return;
		if(desafio.asignatura) {
			const asignatura = ASIGNATURAS[desafio.asignatura];
			desafio.asignatura = asignatura;
		}
		return desafio;
	},
	capsula() {
		const desafio = Session.get("DesafioSeleccionado");
		if(!desafio) return;
		let capsula = VideosCapsulas.findOne({ "meta.desafioId": desafio._id });
		return capsula && capsula.name;
	},
	currentUpload() {
		return Template.instance().currentUpload.get();
	},
	video() {
		const desafio = Session.get("DesafioSeleccionado");
		if( !desafio || !desafio._id ) return false;
		const capsula = VideosCapsulas.findOne({ "meta.desafioId": desafio._id });
		return capsula && capsula.link();
	}
})

Template.desafioestudiante.events({
	"click .contenedor-desafio-estudiante .cruz"() {
		Session.set("DesafioSeleccionado", false);
    document.querySelector(".contenedor-desafio-estudiante")
			.classList.toggle("activo");
		$(".contenedor-desafio-estudiante .detalle").scrollTop(0);
	},
	"click input[type='radio']"(e) {
		$(".cuadro-capsula").hide();
		$("#tipo-" + e.currentTarget.id.split("-")[1]).show();
	},
	"click .btn-guardar-desafio"() {
		const desafio = Session.get("DesafioSeleccionado");
		let doc = {};
		let tipo = document.querySelector("input[type='radio']:checked").value;
		document.querySelectorAll(".campo").forEach(function(item) {
			const atributo = item.id.split("-")[1];
			const anterior = desafio[atributo];
			const esFecha = item.classList.value.indexOf("datetimepicker-component") != -1;
			let valor = esFecha ? moment(item.value, 'DD/MM/YYYY HH:mm').toDate() : item.value;

			if( ( !esFecha && ( anterior !== valor ) ) ||
				( esFecha && ( anterior.getTime() !== valor.getTime() ) ) ) {
				doc[atributo] = valor;
			}
		});

		if(tipo=="V") {
			delete doc["url"];
		}

		var descripcion = $("#summernote").summernote("code");
		if( descripcion != desafio.descripcion ) {
			doc.descripcion = descripcion;
		}
		if(!desafio._id) {
			doc.asignatura = desafio.asignatura;
			doc.nivel = desafio.nivel;
			if(!doc.desde) doc.desde = desafio.desde;
			if(!doc.hasta) doc.hasta = desafio.hasta;
		}
		if( !IsEmpty(doc) ) {
			Meteor.call("GuardarDesafio", desafio._id, doc, function(err, resp) {
				if(!err) {
					Session.set("DesafioSeleccionado", false);
					document.querySelector(".contenedor-desafio-estudiante")
						.classList.toggle("activo");
				}
			})
		} else {
			Session.set("DesafioSeleccionado", false);
			document.querySelector(".contenedor-desafio-estudiante")
				.classList.toggle("activo");
		}
	},
	"click .btn-eliminar-desafio"(e) {
		const desafio = Session.get("DesafioSeleccionado");
		Meteor.call("DetallesEliminarTarea", desafio._id, function(err, resp) {
			if(!err) {
				Session.set("DetallesEliminarTarea", resp);
				$("#modaleliminardesafio").modal("show");
			} else {
				console.error(err);
			}
		});
	},


  "dragover .video": function (e, t) {
    e.stopPropagation();
    e.preventDefault();
    t.$(".drop-video").addClass("activo");
  },
  "dragleave .video": function (e, t) {
    e.stopPropagation();
    e.preventDefault();
    t.$(".drop-video").removeClass("activo");
  },
  'dragenter .video': function (e, t) {
    e.preventDefault();
    e.stopPropagation();
  },
  'drop .video': function (e, t) {
    e.stopPropagation();
    e.preventDefault();
		t.$(".drop-video").removeClass("activo");
		t.$(".uploading-video").addClass("activo");
    var desafio = Session.get("DesafioSeleccionado");
    if (e.originalEvent.dataTransfer.files && e.originalEvent.dataTransfer.files[0]) {
			VideosCapsulas.remove({ "meta.desafioId": desafio._id });
      const upload = VideosCapsulas.insert({
        file: e.originalEvent.dataTransfer.files[0],
        meta: {
          desafioId: desafio._id
        }
      }, false);

      upload.on('start', function () {
        t.currentUpload.set(this);
      });

      upload.on('end', function (error, fileObj) {
        if (error) {
          alert('Error during upload: ' + error);
        } else {
          //console.log("FileImage", fileObj);
        }
        t.currentUpload.set(false);
        t.$(".drop-video").removeClass("activo");
      });
      upload.start();
    }
  },
  'click .video'(e) {
    $("#upload-video").click();
  },
  'change #upload-video'(e, template) {
    var desafio = Session.get("DesafioSeleccionado");
    if (e.currentTarget.files && e.currentTarget.files[0]) {
			VideosCapsulas.remove({ "meta.desafioId": desafio._id });
      const upload = VideosCapsulas.insert({
        file: e.currentTarget.files[0],
        meta: {
          desafioId: desafio._id
        }
      }, false);

      upload.on('start', function () {
        template.currentUpload.set(this);
      });

      upload.on('end', function (error, fileObj) {
        template.currentUpload.set(false);
        $("#upload-video").removeClass("activo");
      });

      upload.start();
    }
  },
	"click .btn-cancelar"() {
		document.querySelector(".contenedor-desafio-estudiante")
			.classList.toggle("activo");
	}
});
