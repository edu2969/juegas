Template.modaleliminartarea.helpers({
	detalle() {
		return Session.get("DetallesEliminarTarea");
	}
})

Template.modaleliminartarea.events({
	"click .btn-cancelar"() {
		$("#modaleliminartarea").modal("hide");
	},
	"click .btn-confirmar"() {
		const tarea = Session.get("TareaSeleccionada");
		Meteor.call("EliminarTarea", tarea._id, function(err, resp) {
			if(!err) {
				$("#modaleliminartarea").modal("hide");
				delete Session.keys.DetallesEliminarTarea;
				delete Session.keys.TareaSeleccionada;
				document.querySelector(".contenedor-tarea")
					.classList.toggle("activo");
			} else {
				console.error(err);	
			}			
		})		
	}
})