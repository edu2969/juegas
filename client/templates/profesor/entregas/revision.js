Template.revision.helpers({
	desafio() {
		return Session.get("RevisionSeleccionada");
	}
})

Template.revision.events({
	"click .contenedor-revision .cruz"() {
    document.querySelector(".contenedor-revision")
			.classList.toggle("activo");
	},
	"click .btn-guardar-revision"() {
    document.querySelector(".contenedor-revision")
			.classList.toggle("activo");
	},
});