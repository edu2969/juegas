const { PERFILES } = require('../../../lib/constantes');

Template.cuentas.onCreated(function () {
	let tipo = PERFILES.indexOf(Router.current().params.tipo) + 1;
	this.perfil = new ReactiveVar(tipo);
	this.cursoId = new ReactiveVar(Cursos.findOne()._id);
});

Template.cuentas.helpers({
	cuentas() {
		const template = Template.instance();
		const perfil = template.perfil.get();
		var selector = { "profile.rol": perfil };
		if(perfil==2) {
			selector["profile.cursoId"] = template.cursoId.get();
		}
		return Meteor.users.find(selector).map(function(usuario) {
			return {
				_id: usuario._id,
				nombres: usuario.profile.nombres,
				username: usuario.username,
				esAdmin: usuario.profile.rol == 1
			}
		})
	},
	perfil() {
		return Template.instance().perfil.get();	
	},
	perfilAlumno() {
		return Template.instance().perfil.get() == 2;
	},
	cursos() {
		return Cursos.find();
	},
	perfiles() {
		const tipo = Router.current().params.tipo;
		return PERFILES.map(perfil => {
			return {
				id: PERFILES.indexOf(perfil) + 1,
				etiqueta: perfil.charAt(0).toUpperCase() + perfil.substr(1),
				seleccionado: perfil == tipo
			}
		});
	}
});

Template.cuentas.events({
	"click .btn-juegas.primario, click #btn-nuevo"(e, template) {
		let id = e.currentTarget.id;
		let perfil = template.perfil.get();
		if( id !== "btn-nuevo" ) {
			let usuario = Meteor.users.findOne({ _id: id });
			Session.set("CuentaSeleccionada", usuario);
		} else {
			let defecto = {
				profile: {
					rol: perfil
				}
			};
			if(perfil==3) {
				defecto.profile.asignaturas = [];
			}
			Session.set("CuentaSeleccionada", defecto);
		}
    document.querySelector(".contenedor-editor-cuenta")
			.classList.toggle("activo");
	},
	"change .selector-perfil"(e, template) {
		let perfil = e.currentTarget.value;
		Router.go('/cuentas/' + PERFILES[perfil - 1]);
	},
	"change .selector-curso"(e, template) {
		template.cursoId.set(e.currentTarget.value);
	}
})