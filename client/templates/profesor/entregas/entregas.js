const {
	EVALUACIONES,
	CALIFICACIONES,
	ASIGNATURAS
} = require('../../../../lib/constantes');

Template.entregas.onCreated(function() {
	this.asignatura = new ReactiveVar(false);
	this.cursoId = new ReactiveVar(false);
});

Template.entregas.rendered = function() {
	const instance = Template.instance();
	Tracker.autorun(() => {
		const profesor = Meteor.user();
		if(!profesor) return false;
		const asignaciones = profesor.profile.asignaciones;
		const cursosIds = [];
		Object.keys(asignaciones).forEach(asignatura => {
			asignaciones[asignatura].forEach(cursoId => {
				if(cursosIds.indexOf(cursoId)==-1) {
					cursosIds.push(cursoId);
				}
			})
		});
		instance.asignatura.set(Object.keys(asignaciones)[0]);
		instance.cursoId.set(cursosIds[0]);
	});
}

Template.entregas.helpers({
	estudiantes() {
		const template = Template.instance();
		const cursoId = template.cursoId.get();
		const asignatura = template.asignatura.get();
		if(!cursoId || !asignatura) {
			return;
		}
		const curso = Cursos.findOne({ _id: cursoId });
		if(!curso) return;
		const nivel = curso.curso.charAt(0)=="P" ? "PK" : curso.curso.charAt(0);
		return Meteor.users.find({ "profile.cursoId": cursoId }).map(function(estudiante) {
			var sumatoria = 0;
			var cantidad = 0;
			let entregas = Desafios.find({
				asignatura: asignatura,
				nivel: nivel
			}, { sort: { desde: -1 }}).map(function(desafio) {
				const entrega = Entregas.findOne({ desafioId: desafio._id, estudianteId: estudiante._id });
				var evaluacion = EVALUACIONES[( entrega && entrega.evaluacion ) || ( entrega && "OK" ) || "SR"];
				let docEntrega = {
					celda: evaluacion
				};
				let ponderacion = EVALUACIONES[( entrega && entrega.evaluacion ) || ( entrega && "OK" ) || "SR"].ponderacion;
				if( entrega && entrega.mejora && entrega.evaluacion == "ME" ) {
					docEntrega.mejora = true;
				}
				sumatoria += ponderacion != -1 && ponderacion;
				cantidad += ponderacion != -1;
				if( entrega && entrega._id ) {
					docEntrega._id = entrega._id;
				}
				return docEntrega;
			});
			let promedio = sumatoria && ( sumatoria / cantidad );
			let calificacion = Object.keys(CALIFICACIONES).filter((key) => {
				return CALIFICACIONES[key].aprueba(promedio);
			})[0];
			return {
				_id: estudiante._id,
				nombres: estudiante.profile.nombres,
				apellidos: estudiante.profile.apellidos,
				entregas: entregas,
				promedio: {
					valor: calificacion,
					color1: CALIFICACIONES[calificacion].colores[0],
					color2: CALIFICACIONES[calificacion].colores[1]
				}
			}
		});
	},
	desafios() {
		const template = Template.instance();
		const asignatura = template.asignatura.get();
		const cursoId = template.cursoId.get();
		if(!cursoId || !asignatura) {
			return;
		}
		const curso = Cursos.findOne({ _id: cursoId });
		if(!curso) return;
		const nivel = curso.curso.charAt(0)=="P" ? "PK" : curso.curso.charAt(0)
		return Desafios.find({
			asignatura: asignatura,
			nivel: nivel
		}, { sort: { desde: -1 }}).map(function(desafio) {
			let entregas = Meteor.users.find({ "profile.cursoId": curso.nivel })
			return {
				_id: desafio._id,
				fecha: desafio.desde
			}
		});
	},
	cursos() {
		const profesor = Meteor.user();
		if(!profesor) return false;
		const asignatura = Template.instance().asignatura.get();
		if(!asignatura) return;
		const asignaciones = profesor.profile.asignaciones;
		const cursosIds = [];
		asignaciones[asignatura].forEach(cursoId => {
			if(cursosIds.indexOf(cursoId)==-1) {
				cursosIds.push(cursoId);
			}
		});
		return cursosIds.map(cursoId => {
			const entidad = Cursos.findOne({ _id: cursoId });
			if(!entidad) return false;
			const curso = entidad.curso;
			let etiqueta = curso.charAt(0) == "P" ? ( "Prekinder " + curso.charAt(2) ) : ( curso + " básico" );
			return {
				_id: entidad._id,
				etiqueta: etiqueta
			};
		});
	},
	asignaturas() {
		const profesor = Meteor.user();
		if(!profesor) return;
		return Object.keys(profesor.profile.asignaciones).map(asignatura => {
			return {
				_id: asignatura,
				etiqueta: ASIGNATURAS[asignatura].label
			}
		});
	}
})

Template.entregas.events({
	"click th.rotated"(e) {
		const renderDesafio = (desafio) => {
			$('#input-desde').datetimepicker({
				locale: moment.locale('es'),
				format: 'DD/MM/YYYY HH:mm',
				defaultDate: desafio.desde
			});

			$('#input-hasta').datetimepicker({
				locale: moment.locale('es'),
				format: 'DD/MM/YYYY HH:mm',
				defaultDate: desafio.hasta
			});

			let tipo = "video";
			if( desafio.url )
				tipo = "url";
			else if( desafio.youtube )
				tipo = "youtube";
			Session.set("DesafioSeleccionado", desafio);
			$("#summernote").summernote("code", desafio.descripcion ? desafio.descripcion : "");
			document.querySelector(".cuadro-capsula").style.display = 'none';
			document.querySelector("#tipo-" + tipo).style.display = 'block';
			document.querySelector("#radio-" + tipo).checked = true;
			document.querySelector(".contenedor-desafio-estudiante").classList.toggle("activo");
		}

		const id = e.currentTarget.id;
		["video", "youtube", "url"].forEach(function(tipo) {
			document.querySelector("#tipo-" + tipo).style.display = 'none';
		});
		let desafio = {
			"titulo" : "",
			"unidad" : "",
			"objetivo" : "",
			"que" : "",
			"paraque" : "",
			"como" : "",
			"youtube" : "",
			"url" : "",
			"kpsi1" : "",
			"kpsi2" : "",
			"kpsi3" : "",
			"kpsi4" : "",
			"descripcion" : " ",
		}
		if( id ) {
			desafio = Desafios.findOne({ _id: id });
			renderDesafio(desafio);
		} else {
			desafio.asignatura = $("#select-asignatura").val();
			const curso = Cursos.findOne({ _id: $("#select-curso").val() });
			desafio.nivel = curso.curso.charAt(0)=="P" ? "PK" : curso.curso.charAt(0);
			desafio.desde = moment().startOf("day").hour(8).toDate();
			desafio.hasta = moment().startOf("day").add(44, "hour").toDate();
			Session.set("DesafioSeleccionado", desafio);
			renderDesafio(desafio);
		}
	},
	"click td"(e) {
		const id = e.currentTarget.id;
		if(!id) return;
		$(".evaluacion.seleccionado").toggleClass("seleccionado");
		const entrega = Entregas.findOne({ _id: id });
		Session.set("Seleccion", {
			desafio: Desafios.findOne({ _id: entrega.desafioId }),
			entrega: entrega
		});
    document.querySelector(".contenedor-revision").classList.toggle("activo");
	},
	"change #select-curso"(e, template) {
		const nivel = e.currentTarget.value;
		template.cursoId.set(nivel);
	},
	"change #select-asignatura"(e, template) {
		const asignatura = e.currentTarget.value;
		template.asignatura.set(asignatura);
		const profesor = Meteor.user();
		const asignaciones = profesor.profile.asignaciones;
		const cursosId = asignaciones[asignatura];
		template.cursoId.set(cursosId[0]);
	},
});
