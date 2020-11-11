Template.tarea.helpers({
	desafio() {
		return Session.get("TareaSeleccionada");
	}
})

Template.tarea.events({
	"click .contenedor-tarea .cruz"() {
    document.querySelector(".contenedor-tarea")
			.classList.toggle("activo");
	},
	"click .btn-guardar-tarea"() {
    document.querySelector(".contenedor-tarea")
			.classList.toggle("activo");
	},
});