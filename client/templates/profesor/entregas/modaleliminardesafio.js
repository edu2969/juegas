Template.modaleliminardesafio.helpers({
	detalle() {
		return Session.get("DetallesEliminarDesafio");
	}
})

Template.modaleliminardesafio.events({
	"click .btn-cancelar"() {
		$("#modaleliminardesafio").modal("hide");
	},
	"click .btn-confirmar"() {
		const tarea = Session.get("DesafioSeleccionado");
		Meteor.call("EliminarDesafio", tarea._id, function(err, resp) {
			if(!err) {
				$("#modaleliminardesafio").modal("hide");
				delete Session.keys.DetallesEliminarDesafio;
				delete Session.keys.DesafioSeleccionado;
				document.querySelector(".contenedor-desafio-estudiante")
					.classList.toggle("activo");
			} else {
				console.error(err);
			}
		})
	}
})
