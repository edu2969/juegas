Template.app.helpers({
	loginIn() {
		return Meteor.user();
	}
})

Template.app.events({
  "click section[name='contenido'] .menu"() {
    document.querySelector(".contenedor-menu").classList.toggle("activo");
  },
});