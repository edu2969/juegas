Template.menu.events({
  "click #link-logout"() {
    Session.set("EstadoApp", false);
  }
});