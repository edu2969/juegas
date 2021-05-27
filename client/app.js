Template.app.helpers({
  loginIn() {
    return Meteor.user();
  },
  esEstudiante() {
    const usuario = Meteor.user();
    if (!usuario) return false;
    return usuario.profile.rol == 2;
  },
});

Template.app.events({
  "click section[name='contenido'] .menu"() {
    document.querySelector(".contenedor-menu").classList.toggle("activo");
  },
});
