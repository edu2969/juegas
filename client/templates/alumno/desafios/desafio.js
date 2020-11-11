Template.desafio.helpers({
	desafio() {
		return Session.get("DesafioSeleccionado");
	}
})

Template.desafio.events({
	"click .contenedor-desafio .cruz"() {
    document.querySelector(".contenedor-desafio")
			.classList.toggle("activo");
	},
	"click .btn-enviar-desafio"() {
    document.querySelector(".contenedor-desafio")
			.classList.toggle("activo");
	},
	"click .marco-desafio .nombre"() {
    document.querySelector(".marco-foto-full")
			.classList.toggle("activo");
	}
});