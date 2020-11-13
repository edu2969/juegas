Template.tarea.rendered = function() {
	$('.datetimepicker-component').datetimepicker({
		format: 'DD/MM/YYYY HH:mm',
		minDate: moment().startOf('hour').toDate(),
		maxDate: moment().startOf('hour').add(2, 'month').toDate()
	});
}

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