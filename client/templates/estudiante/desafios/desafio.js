export {
  ImagesEvidencias, VideosCapsulas
};

const { ASIGNATURAS, EVALUACIONES } = require('../../../../lib/constantes');

var currentUpload;

Template.desafio.onCreated(function () {
  currentUpload = new ReactiveVar(false);
});

Template.desafio.helpers({
	desafio() {
		let desafio = Session.get("DesafioSeleccionado");
		if(!desafio) return;
		let entrega = Entregas.findOne({ desafioId: desafio._id });
		if(!entrega) entrega = {};
		desafio.asignaturaObj = ASIGNATURAS[desafio.asignatura];
		if(desafio.youtube) {
			desafio.youtubeId = desafio.youtube.split("?v=")[1];
		}
		const valoresKpsis = entrega.kpsis || desafio.respuestasKpsis || [-1, -1, -1, -1];
		desafio.kpsis = [ desafio.kpsi1, desafio.kpsi2, desafio.kpsi3, desafio.kpsi4 ].map((kpsi, index) => {
			let resultado = {
				indice: index,
				letra: String.fromCharCode(97 + index),
				valor: kpsi
			};
			if(valoresKpsis[index]!=-1) {
				resultado["seleccionado" + valoresKpsis[index]] = true;
			}									
			return resultado;
		});
		return desafio;
	},
	capsula() {
		let desafio = Session.get("DesafioSeleccionado");
		if(!desafio) return;
		let capsula = VideosCapsulas.findOne({ "meta.desafioId": desafio._id });
		return capsula && capsula.link();
	},
	fotos() {
		const desafio = Session.get("DesafioSeleccionado");
		if(!desafio) return;
		return ImagesEvidencias.find({ "meta.desafioId": desafio._id }).map(function(foto, index) {
			let img = ImagesEvidencias.findOne({ _id: foto._id });
			let imagen = img && img.link();
			return {
				_id: foto._id,
				imagen: imagen,
				indice: index + 1
			}
		});
	},
	tieneFotos() {
		let desafio = Session.get("DesafioSeleccionado");
		if(!desafio) return false;
		return ImagesEvidencias.find({ "meta.desafioId": desafio._id }).count();
	},
	entrega() {
		let desafio = Session.get("DesafioSeleccionado");
		if(!desafio) return false;
		var entrega = Entregas.findOne({ desafioId: desafio._id });
		if(!entrega) {
			entrega = { };
		}
		entrega.calificacion = EVALUACIONES[entrega.evaluacion];
		const fechaLimite = moment(desafio.hasta);
		if( moment().isBefore(fechaLimite) && 
			 ( !entrega.calificacion || entrega.calificacion.ponderacion <= 2 ) ) {
			entrega.abierta = true;
		}
		return entrega;
	}
})

Template.desafio.events({
	"click .contenedor-desafio .cruz"() {
		Session.set("DesafioSeleccionado", {});
    document.querySelector(".contenedor-desafio")
			.classList.toggle("activo");
	},
	"click .btn-enviar-desafio"() {
		let desafio = Session.get("DesafioSeleccionado");
		let doc = { 
			desafioId: desafio._id
		};
		const entrega = Entregas.findOne();
		if(entrega) {
			doc.entregaId = entrega._id;
		} else {
			doc.kpsis = desafio.respuestasKpsis || [-1, -1, -1, -1];
		}
		Meteor.call("EnviarDesafio", doc, function(err, resp) {
			if(!err) {
				Session.set("DesafioSeleccionado", {});
		    document.querySelector(".contenedor-desafio")
					.classList.toggle("activo");
			}
		});
	},
	"click .marco-desafio .nombre"(e) {
		let img = ImagesEvidencias.findOne({ _id: e.currentTarget.id });
		Session.set("ImagenSeleccionada", img && img.link());
    document.querySelector(".marco-foto-full")
			.classList.toggle("activo");
	},	
  "dragover .camara": function (e, t) {
    e.stopPropagation();
    e.preventDefault();
    t.$(".drop-texto").addClass("activo");
  },
  "dragleave .camara": function (e, t) {
    e.stopPropagation();
    e.preventDefault();
    t.$(".drop-texto").removeClass("activo");
  },
  'dragenter .camara': function (e, t) {
    e.preventDefault();
    e.stopPropagation();
  },
  'drop .camara': function (e, t) {
    e.stopPropagation();
    e.preventDefault();
    var desafio = Session.get("DesafioSeleccionado");
    if (e.originalEvent.dataTransfer.files && e.originalEvent.dataTransfer.files[0]) {
      const upload = ImagesEvidencias.insert({
        file: e.originalEvent.dataTransfer.files[0],
        streams: 'dynamic',
        chunkSize: 'dynamic',
        meta: {
          desafioId: desafio._id
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
        t.$(".drop-texto").removeClass("activo");
      });
      upload.start();
    }
  },
  'click .camara'(e) {
    $("#upload-image").click();
  },
  'change #upload-image'(e) {
    var desafio = Session.get("DesafioSeleccionado");
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      const upload = ImagesEvidencias.insert({
        file: e.currentTarget.files[0],
        streams: 'dynamic',
        chunkSize: 'dynamic',
        meta: {
          desafioId: desafio._id
        }
      }, false);

      upload.on('start', function () {
        currentUpload.set(this);
      });

      upload.on('end', function (error, fileObj) {
        currentUpload.set(false);
        $("#upload-image").removeClass("activo");       
      });
			
      upload.start();
    }
  },
	"click .eliminar"(e, template) {
		ImagesEvidencias.remove({ _id: e.currentTarget.id });
	},
	"click .numero"(e, template) {
		const numero = e.currentTarget.innerHTML;
		const indice = e.currentTarget.parentElement.id;
		let desafio = Session.get("DesafioSeleccionado");
		if(!desafio.respuestasKpsis) {
			desafio.respuestasKpsis = [-1, -1, -1, -1];
		}
		desafio.respuestasKpsis[indice] = numero;
		Session.set("DesafioSeleccionado", desafio);
	}
});