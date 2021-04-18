export {
  ImagesEvidencias
};

const { EVALUACIONES } = require('../../../../lib/constantes');

Template.revision.helpers({
	revision() {
		const revision = Session.get("Seleccion");
		if(!revision || !revision.desafio) return;
		const desafio = revision.desafio;
		const entrega = revision.entrega;
		const valoresKpsis = entrega.kpsis || [-1, -1, -1, -1];
		entrega.kpsis = [
			desafio.kpsi1, desafio.kpsi2,
			desafio.kpsi3, desafio.kpsi4
		].map((kpsi, index) => {
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
		return revision;
	},
	evaluaciones() {
		const revision = Session.get("Seleccion");
		if(!revision || !revision.desafio) return;
		const keys = Object.keys(EVALUACIONES);
		keys.pop();
		return keys.map(function(key) {
			let evaluacion = EVALUACIONES[key];
			evaluacion.llave = key;
			delete evaluacion.seleccionado;
			if(revision) {
				if(revision.entrega.evaluacion==key) {
					evaluacion.seleccionado = true;
				}
			}
			return evaluacion;
		});
	},
	fotos() {
		const revision = Session.get("Seleccion");
		if(!revision || !revision.desafio) return;
		return ImagesEvidencias.find({
			"meta.desafioId": revision.desafio._id,
      userId: revision.entrega.estudianteId
		}).map(function(image, index) {
			var img = ImagesEvidencias.findOne({ _id: image._id });
			return {
				_id: image._id,
				imagen: img && img.link(),
				indice: index + 1
			}
		})
	},
	cantidadEvidencias() {
		const revision = Session.get("Seleccion");
		if(!revision || !revision.desafio) return;
		return ImagesEvidencias.find({
			"meta.desafioId": revision.desafio._id
		}).count() || "Sin evidencias";
	}
})

Template.revision.events({
	"click .contenedor-revision .cruz"() {
		Session.set("Seleccion", {});
    document.querySelector(".contenedor-revision")
			.classList.toggle("activo");
	},
	"click .btn-guardar-revision"() {
		let seleccion = Session.get("Seleccion");
		let entregaId = seleccion.entrega._id;
		let comentario = document.querySelector("#input-comentarios").value;
		let evaluacion = document.querySelector(".seleccionado").id;
		Meteor.call("GuardarEvaluacion", {
			entregaId: entregaId,
			comentario: comentario,
			evaluacion: evaluacion
		}, function(err, resp) {
			Session.set("Seleccion", {});
			document.querySelector(".contenedor-revision")
				.classList.toggle("activo");
		})
	},
	"click .evaluacion"(e) {
		document.querySelectorAll(".evaluacion").forEach(function(selector) {
			selector.classList.remove("seleccionado");
		});
		e.currentTarget.classList.add("seleccionado");
		document.querySelector(".btn-guardar-revision").classList.add("habilitado");
	},
	"click .foto"(e) {
		let img = ImagesEvidencias.findOne({ _id: e.currentTarget.id });
		Session.set("ImagenSeleccionada", img && img.link());
    document.querySelector(".marco-foto-full")
			.classList.toggle("activo");
	}
});
