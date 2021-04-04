Template.foto.helpers({
	foto() {
		return Session.get("ImagenSeleccionada");
	}
})

Template.foto.events({
	"click .marco-foto-full .cruz"() {
    document.querySelector(".marco-foto-full")
			.classList.toggle("activo");
	},
	"click .zoom"() {
		document.querySelector(".foto-alumno")
			.classList.toggle("zoom-out");
		document.querySelector(".zoom .material-icons").innerText = "zoom_" + ( document.querySelector(".zoom .material-icons").innerText.indexOf("out")!=-1 ? "in" : "out" );
	}
})