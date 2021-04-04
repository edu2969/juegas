Template.login.onCreated(function () {
  this.errores = new ReactiveVar(false);
});

Template.login.rendered = function () {

}

Template.login.helpers({
  errores() {
    return Template.instance().errores.get();
  }
});

Template.login.events({
  "click .formulario #btn-login"(e, template) {
    let rut = document.querySelector("#input-rut").value;
    let password = document.querySelector("#input-password").value;

    Meteor.loginWithPassword({
      username: rut
    }, password, function (err, resp) {
      if (!err) {
        if (Meteor.user().profile.rol == 2) {
          Router.go('/desafios');
        } else if( Meteor.user().profile.rol == 1 ) {
          Router.go('/cuentas/profesor');
        } else {
          Router.go('/entregas');
        }
      } else {
        template.errores.set("Ups!, no puedes jugar :(");
      }
    });
  }
});