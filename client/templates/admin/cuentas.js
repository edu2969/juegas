Template.cuentas.onCreated(function () {
	this.perfil = new ReactiveVar(1);
	this.cursoId = new ReactiveVar(false);
})

Template.cuentas.rendered = function() {
	const template = Template.instance();
	Tracker.autorun(() => {
		Meteor.subscribe('cuentas', template.perfil.get());
		const cursoId = template.cursoId.get();
		if(!cursoId) {
			const curso = Cursos.findOne();
			if(!curso) return;
			template.cursoId.set(curso._id);
		}
	});
}

Template.cuentas.helpers({
	cuentas() {
		const template = Template.instance();
		const perfil = template.perfil.get();
		var selector = { "profile.rol": perfil };
		if(perfil==2) {
			selector["profile.curso"] = template.cursoId.get();
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
		template.perfil.set(Number(perfil));
	},
	"change .selector-curso"(e, template) {
		template.cursoId.set(e.currentTarget.value);
	}
})