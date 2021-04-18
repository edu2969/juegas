const { ASIGNATURAS, PERFILES } = require('../../../lib/constantes');

Template.editorCuenta.onCreated(function() {
	this.asignaturaSeleccionada = new ReactiveVar(false);
	this.error = new ReactiveVar(false);
});

Template.editorCuenta.rendered = () => {
	const instance = Template.instance();
	Tracker.autorun(() => {
		const cuenta = Session.get("CuentaSeleccionada");
		if(!cuenta) return;
		const actual = PERFILES.indexOf(Router.current().params.tipo) + 1;
		const asignaciones = cuenta.profile.asignaciones;
		if(asignaciones && !instance.asignaturaSeleccionada.get()) {
			const primera = Object.keys(asignaciones)[0];
			console.log("PRIMERA", primera);
			instance.asignaturaSeleccionada.set(primera);
		}
	});
}

Template.editorCuenta.helpers({
	cuenta() {
		let cuenta = Session.get("CuentaSeleccionada");
		if(cuenta && cuenta.profile && cuenta.profile.rol == 3) {
			cuenta.esProfesor = true;
		}
		return cuenta;
	},
	asignaturas() {
		let keys = Object.keys(ASIGNATURAS);
		let cuenta = Session.get("CuentaSeleccionada");
		if(!cuenta) return false;
		if( cuenta.profile.rol!=3 ) return;
		return keys.map(function(asignatura) {
			let checked;
			if( cuenta.profile.asignaciones && cuenta.profile.asignaciones[asignatura] ) {
				checked = true;
			}
			return {
				llave: asignatura,
				etiqueta: ASIGNATURAS[asignatura].label,
				checked: checked
			}
		});
	},
	cursos() {
		const instance = Template.instance();
		const cuenta = Session.get("CuentaSeleccionada");
		if( !cuenta || cuenta.profile.rol!=3 ) return;
		let asignaciones = cuenta.profile.asignaciones;
		const cursoSeleccionado = instance.asignaturaSeleccionada.get();
		return Cursos.find().map(cursoEntity => {
			const asignaturaSeleccionada = instance.asignaturaSeleccionada.get();
			const asignatura = asignaciones[asignaturaSeleccionada];
			if(asignatura && asignatura.indexOf(cursoEntity._id)!=-1) {
				cursoEntity.activo = true;
			}
			return cursoEntity;
		});
	},
	asignaturasSeleccionadas() {
		const cuenta = Session.get("CuentaSeleccionada");
		if( !cuenta || cuenta.profile.rol!=3 ) return;
		const keys = Object.keys(cuenta.profile.asignaciones);
		const asignaturaSeleccionada = Template.instance().asignaturaSeleccionada.get();
		return keys.map(asignatura => {
			return {
				glosa: ASIGNATURAS[asignatura].label,
				asignatura: asignatura,
				seleccionada: asignatura == asignaturaSeleccionada
			}
		});
	},
	error() {
		return Template.instance().error.get();
	},
	asignaturaSeleccionada() {
		console.log("REACTIVO@@", Template.instance().asignaturaSeleccionada.get());
		return Template.instance().asignaturaSeleccionada.get();
	}
});

let ocultarEditor = (template) => {
	document.querySelector(".contenedor-editor-cuenta")
			.classList.toggle("activo");
	template.asignaturaSeleccionada.set(false);
	delete Session.keys.CuentaSeleccionada;
}

Template.editorCuenta.events({
	"click .contenedor-editor-cuenta .cruz, click #btn-cancelar"(e, template) {
    ocultarEditor(template);
	},
	"click #btn-guardar"(e, template) {
		let cuenta = Session.get("CuentaSeleccionada");
		let doc = { }
		document.querySelectorAll("input[type='text']").forEach(function(item) {
			let atributo = item.id.split("-")[1];
			if( atributo == "password" ) {
				if(!IsEmpty(item.value)) doc.password = item.value;
			} else if( atributo == "username" ) {
				if(cuenta.username !== item.value) doc.username = item.value;
			} else if( cuenta.profile[atributo] !== item.value ) {
				doc[atributo] = item.value;
			}
		});
		let perfil = Number(document.querySelector("select").value);
		if(cuenta.profile.rol != perfil) doc.perfil = perfil;
		if(perfil == 3) {
			doc.asignaciones = cuenta.profile.asignaciones;
		}
		if(!IsEmpty(doc)) {
			let valido = true;
			if(cuenta._id) {
				doc._id = cuenta._id;
			} else {
				valido = Object.keys(doc).length == 5;
			}
			if(valido) {
				Meteor.call("ActualizarCuenta", doc, function(err, resp) {
					if(!err) {
						ocultarEditor(template);
					}
				});
			} else {
				document.querySelectorAll("input").forEach(function(item) {
					item.classList.remove("is-invalid");
					if(item.value == "") {
						item.classList.add("is-invalid");
					}
				});
				template.error.set("<i class='material-icons'>warning</i><span> Los campos son obligatorios</span>");
			}

		} else ocultarEditor(template);
	},
	"click ul.cursos li"(e, template) {
		const target = e.currentTarget;
		const curso = target.innerText;
		var cuenta = Session.get("CuentaSeleccionada");
		var asignaciones = cuenta.profile.asignaciones;
		const asignatura = $("#selector-asignaturas").val();
		const cursoEntity = Cursos.findOne({ curso: curso });
		const indice = asignaciones[asignatura].indexOf(cursoEntity._id);
		if(indice==-1) {
			asignaciones[asignatura].push(cursoEntity._id);
		} else {
			asignaciones[asignatura].splice(indice, 1);
		}
		asignaciones[asignatura].sort((a, b) => {
			const cursoA = Cursos.findOne({ _id: a });
			const cursoB = Cursos.findOne({ _id: b });
			return cursoA.curso < cursoB.curso ? -1 : 1;
		});
		cuenta.profile.asignaciones = asignaciones;
		Session.set("CuentaSeleccionada", cuenta);
	},
	"click .checkbox-asignatura"(e, template) {
		const asignatura = e.currentTarget.value;
		const isChecked = e.currentTarget.checked;
		const cuenta = Session.get("CuentaSeleccionada");
		let asignaciones = cuenta.profile.asignaciones;
		if(isChecked) {
			asignaciones[asignatura] = [];
		} else {
			delete asignaciones[asignatura];
			if($("#selector-asignaturas").val()==asignatura && asignaciones.length) {
				template.asignaturaSeleccionada.set(asignaciones[0].asignatura);
			}
		};
		cuenta.profile.asignaciones = asignaciones;
		Session.set("CuentaSeleccionada", cuenta);
	},
	"change #selector-asignaturas"(e, template) {
		template.asignaturaSeleccionada.set($("#selector-asignaturas").val());
	}
})
