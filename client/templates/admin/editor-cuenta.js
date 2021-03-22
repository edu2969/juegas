Template.editorCuenta.onCreated(function() {
	this.error = new ReactiveVar(false);
	this.asignaturaSeleccionada = new ReactiveVar(false);
	Meteor.subscribe('cursos');
});

Template.editorCuenta.rendered = () => {
	const instance = Template.instance();
	Tracker.autorun(() => {
		const cuenta = Session.get("CuentaSeleccionada");
		if(!cuenta) return;
		const asignaturas = cuenta.profile.asignaturas;
		const actual = instance.asignaturaSeleccionada.get();
		if(asignaturas && !actual) {
			const primera = Object.keys(asignaturas)[0];
			instance.asignaturaSeleccionada.set(primera);
		}
	})
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
			if( cuenta.profile.asignaturas && cuenta.profile.asignaturas[asignatura] ) {
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
		if( cuenta.profile.rol!=3 ) return;
		let asignaturas = cuenta.profile.asignaturas;
		const cursoSeleccionado = instance.asignaturaSeleccionada.get();
		return Cursos.find().map(curso => {
			const nivel = curso.nivel;
			const asignaturaSeleccionada = instance.asignaturaSeleccionada.get();
			const asignaciones = asignaturas[asignaturaSeleccionada];
			if(asignaciones && asignaciones.indexOf(curso._id)!=-1) {
				curso.activo = true;
			}
			return curso;
		});
	},
	asignaturasSeleccionadas() {
		const cuenta = Session.get("CuentaSeleccionada");
		if( cuenta.profile.rol!=3 ) return;
		const keys = Object.keys(cuenta.profile.asignaturas);
		return keys.map(asignatura => {
			return {
				glosa: ASIGNATURAS[asignatura].label,
				asignatura: asignatura 
			}
		});
	},
	error() {
		return Template.instance().error.get();
	}
});

let ocultarEditor = () => {
	document.querySelector(".contenedor-editor-cuenta")
			.classList.toggle("activo");
	delete Session.keys.CuentaSeleccionada;
}

Template.editorCuenta.events({
	"click .contenedor-editor-cuenta .cruz"() {
    ocultarEditor();
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
			doc.asignaturas = cuenta.profile.asignaturas;
		}
		if(!IsEmpty(doc)) {
			let valido = true;
			if(cuenta._id) {
				doc._id = cuenta._id;
			} else {
				valido = Object.keys(doc).length == 5;
			}
			if(valido) {
				console.log(doc);
				Meteor.call("ActualizarCuenta", doc, function(err, resp) {
					if(!err) {
						ocultarEditor();
					}
				});
			} else {
				document.querySelectorAll("input").forEach(function(item) {
					item.classList.remove("is-invalid");
					if(item.value == "") {
						console.log(item.id, "vacio");
						item.classList.add("is-invalid");
					}
				});
				template.error.set("<i class='material-icons'>warning</i><span> Los campos son obligatorios</span>");
			}

		} else ocultarEditor();		
	},
	"click ul.cursos li"(e, template) {
		const target = e.currentTarget;
		const curso = target.innerText;
		var cuenta = Session.get("CuentaSeleccionada");
		var asignaturas = cuenta.profile.asignaturas;
		const asignatura = $("#selector-asignaturas").val();
		const cursoEntity = Cursos.findOne({ nivel: curso });
		asignaturas[asignatura].push(cursoEntity._id);
		cuenta.profile.asignaturas = asignaturas;
		Session.set("CuentaSeleccionada", cuenta);
	},
	"click .checkbox-asignatura"(e, template) {
		const asignatura = e.currentTarget.value;
		const isChecked = e.currentTarget.checked;
		const cuenta = Session.get("CuentaSeleccionada");
		let asignaturas = cuenta.profile.asignaturas;
		if(isChecked) {
			asignaturas[asignatura] = [];
		} else {
			delete asignaturas[asignatura];
		};
		cuenta.profile.asignaturas = asignaturas;
		Session.set("CuentaSeleccionada", cuenta);
	},
	"change #selector-asignaturas"(e, template) {
		template.asignaturaSeleccionada.set($("#selector-asignaturas").val());
	}
})