export {
  Capsulas
};

var currentUpload;

Template.tarea.onCreated(function() {
	currentUpload = new ReactiveVar(false);
});

Template.tarea.rendered = () => {
	Tracker.autorun(() => {
		const tarea = Session.get("TareaSeleccionada");
		if( !tarea || !tarea._id ) return false;		
		Meteor.subscribe('capsula', tarea._id);
	});
}

Template.tarea.helpers({
	tarea() {
		const tarea = Session.get("TareaSeleccionada");
		if(!tarea) return;
		const asignatura = ASIGNATURAS[tarea.asignatura];
		tarea.asignatura = asignatura;
		return tarea;
	},
	capsula() {
		const tarea = Session.get("TareaSeleccionada");
		if(!tarea) return;
		let capsula = Capsulas.findOne({ "meta.tareaId": tarea._id });
		return capsula && capsula.link();
	},
	currentUpload() {
		return currentUpload.get();
	},
	video() {
		const tarea = Session.get("TareaSeleccionada");
		if( !tarea || !tarea._id ) return false;
		const capsula = Capsulas.findOne({ "meta.tareaId": tarea._id });
		return capsula && capsula.link();
	}
})

Template.tarea.events({
	"click .contenedor-tarea .cruz"() {
		delete Session.keys.TareaSeleccionada;
    document.querySelector(".contenedor-tarea")
			.classList.toggle("activo");
	},
	"click input[type='radio']"(e) {
		$(".cuadro-capsula").hide();
		$("#tipo-" + e.currentTarget.id.split("-")[1]).show();
	},
	"click .btn-guardar-tarea"() {
		const tarea = Session.get("TareaSeleccionada");
		let doc = {};
		let tipo = document.querySelector("input[type='radio']:checked").value;
		document.querySelectorAll(".campo").forEach(function(item) {
			const atributo = item.id.split("-")[1];
			const anterior = tarea[atributo];
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
		if( descripcion != tarea.descripcion ) {
			doc.descripcion = descripcion;
		}
		delete Session.keys.TareaSeleccionada;
		if( !IsEmpty(doc) ) {
			Meteor.call("GuardarTarea", tarea._id, doc, function(err, resp) {
				if(!err) {
					document.querySelector(".contenedor-tarea")
						.classList.toggle("activo");
				}
			})
		} else document.querySelector(".contenedor-tarea")
			.classList.toggle("activo");
	},
	"click .btn-eliminar-tarea"(e) {
		const tarea = Session.get("TareaSeleccionada");
		Meteor.call("DetallesEliminarTarea", tarea._id, function(err, resp) {
			if(!err) {
				Session.set("DetallesEliminarTarea", resp);
				$("#modaleliminartarea").modal("show");
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
    var tarea = Session.get("TareaSeleccionada");
    if (e.originalEvent.dataTransfer.files && e.originalEvent.dataTransfer.files[0]) {
			Capsulas.remove({ "meta.tareaId": tarea._id });
      const upload = Capsulas.insert({
        file: e.originalEvent.dataTransfer.files[0],
        streams: 'dynamic',
        chunkSize: 'dynamic',
        meta: {
          tareaId: tarea._id
        }
      }, false);

      upload.on('start', function () {
        currentUpload.set(this);
      });
			
      upload.on('end', function (error, fileObj) {
        if (error) {
          alert('Error during upload: ' + error);
        } else {
          //console.log("FileImage", fileObj);
        }
        currentUpload.set(false);
        t.$(".drop-video").removeClass("activo");
      });
      upload.start();
    }
  },
  'click .video'(e) {
    $("#upload-video").click();
  },
  'change #upload-video'(e) {
    var tarea = Session.get("TareaSeleccionada");
    if (e.currentTarget.files && e.currentTarget.files[0]) {
			Capsulas.remove({ "meta.tareaId": tarea._id });
      const upload = Capsulas.insert({
        file: e.currentTarget.files[0],
        streams: 'dynamic',
        chunkSize: 'dynamic',
        meta: {
          tareaId: tarea._id
        }
      }, false);

      upload.on('start', function () {
        currentUpload.set(this);
      });

      upload.on('end', function (error, fileObj) {
        currentUpload.set(false);
        $("#upload-video").removeClass("activo");       
      });
			
      upload.start();
    }
  },
});