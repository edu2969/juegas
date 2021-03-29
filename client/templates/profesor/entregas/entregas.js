Template.entregas.onCreated(function() {
	this.asignatura = new ReactiveVar(false);
	this.cursoId = new ReactiveVar(false);
});

Template.entregas.rendered = function() {	
	const instance = Template.instance();
	Meteor.subscribe('cursos');
	Tracker.autorun(() => {
		if(!instance.cursoId.get()) {
			const profesor = Meteor.user();
			if(!profesor) return false;
			const asignaturas = profesor.profile.asignaturas;
			const cursos = [];
			Object.keys(asignaturas).forEach(asignatura => {
				asignaturas[asignatura].forEach(curso => {
					if(cursos.indexOf(curso)==-1) {
						cursos.push(curso);
					}
				})
			});
			instance.asignatura.set(Object.keys(asignaturas)[0]);
			instance.cursoId.set(cursos[0]);
		}
		Meteor.subscribe('alumnosCurso', instance.cursoId.get());
		Meteor.subscribe('desafios', false);
		Meteor.subscribe('entregasPorNivel', instance.cursoId.get());
	});
}

Template.entregas.helpers({
	alumnos() {
		const template = Template.instance();
		const cursoId = template.cursoId.get();
		const asignatura = template.asignatura.get();
		if(!cursoId || !asignatura) {
			return;
		}
		console.log("C, A", cursoId, asignatura);
		const curso = Cursos.findOne({ _id: cursoId });
		console.log("CURSO=====>", curso);
		if(!curso) return;
		const nivel = curso.nivel.charAt(0)=="P" ? "PK" : curso.nivel.charAt(0);
		return Meteor.users.find({ "profile.curso": cursoId }).map(function(alumno) {
			var sumatoria = 0;
			var cantidad = 0;
			console.log("TAREA", {
				asignatura: asignatura,
				nivel: nivel
			});
			let entregas = Tareas.find({
				asignatura: asignatura,
				nivel: nivel
			}).map(function(tarea) {
				const entrega = Entregas.findOne({ tareaId: tarea._id, alumnoId: alumno._id });
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
				_id: alumno._id,
				nombres: alumno.profile.nombres,
				apellidos: alumno.profile.apellidos,
				entregas: entregas,
				promedio: {
					valor: calificacion,
					color1: CALIFICACIONES[calificacion].colores[0],
					color2: CALIFICACIONES[calificacion].colores[1]
				}
			}
		});
	},
	tareas() {
		const template = Template.instance();
		const asignatura = template.asignatura.get();
		const cursoId = template.cursoId.get();
		if(!cursoId || !asignatura) {
			return;
		}
		const curso = Cursos.findOne({ _id: cursoId });
		if(!curso) return;
		const nivel = curso.nivel.charAt(0)=="P" ? "PK" : curso.nivel.charAt(0)
		return Tareas.find({
			asignatura: asignatura,
			nivel: nivel
		}).map(function(tarea) {
			let entregas = Meteor.users.find({ "profile.curso": curso.nivel })
			return {
				_id: tarea._id,
				fecha: tarea.desde
			}
		})
	},
	cursos() {
		const profesor = Meteor.user();
		if(!profesor) return false;
		const asignatura = Template.instance().asignatura.get();
		if(!asignatura) return;
		const asignaturas = profesor.profile.asignaturas;
		const cursos = [];
		asignaturas[asignatura].forEach(curso => {
			if(cursos.indexOf(curso)==-1) {
				cursos.push(curso);
			}
		});
		return cursos.map(curso => {
			const entidad = Cursos.findOne({ _id: curso });
			if(!entidad) return false;
			const nivel = entidad.nivel;
			let etiqueta = nivel.charAt(0) == "P" ? ( "Prekinder " + nivel.charAt(2) ) : ( nivel + " básico" ); 
			return {
				_id: entidad._id,
				etiqueta: etiqueta
			};
		});
	},
	asignaturas() {
		const profesor = Meteor.user();
		if(!profesor) return;
		return Object.keys(profesor.profile.asignaturas).map(asignatura => {
			return {
				_id: asignatura,
				etiqueta: ASIGNATURAS[asignatura].label
			}
		});
	}
})

Template.entregas.events({
	"click th.rotated"(e) {
		const renderTarea = (tarea) => {
			$('#input-desde').datetimepicker({
				format: 'DD/MM/YYYY HH:mm',
				defaultDate: moment(tarea.desde, "DD/MM/YYYY HH:mm")
			});

			$('#input-hasta').datetimepicker({
				format: 'DD/MM/YYYY HH:mm',
				defaultDate: moment(tarea.hasta, "DD/MM/YYYY HH:mm")
			});

			let tipo = "video";
			if( tarea.url ) 
				tipo = "url"; 
			else if( tarea.youtube ) 
				tipo = "youtube";
			Session.set("TareaSeleccionada", tarea);
			$("#summernote").summernote("code", tarea.descripcion ? tarea.descripcion : "");
			document.querySelector(".cuadro-capsula").style.display = 'none';
			document.querySelector("#tipo-" + tipo).style.display = 'block';
			document.querySelector("#radio-" + tipo).checked = true;
			document.querySelector(".contenedor-tarea").classList.toggle("activo");
		}
		
		const id = e.currentTarget.id;
		["video", "youtube", "url"].forEach(function(tipo) {
			document.querySelector("#tipo-" + tipo).style.display = 'none';
		});
		let tarea = {};
		if( id ) {
			tarea = Tareas.findOne({ _id: id });
			renderTarea(tarea);
		} else {
			tarea.asignatura = $("#select-asignatura").val();
			const curso = Cursos.findOne({ _id: $("#select-curso").val() });
			tarea.nivel = curso.nivel.charAt(0)=="P" ? "PK" : curso.nivel.charAt(0);
			tarea.desde = moment().startOf("day").hour(8).toDate();
			tarea.hasta = moment().startOf("day").add(44, "hour").toDate();
			Session.set("TareaSeleccionada", tarea);
			Meteor.call("GuardarTarea", false, tarea, function(err, resp) {
				if(!err) {
					tarea._id = resp;
					renderTarea(tarea);
				} else {
					console.ward("Ha habido un error al crear la tarea");
				}
			});			
		}
	},
	"click td"(e) {
		const id = e.currentTarget.id;
		if(!id) return;
		$(".evaluacion.seleccionado").toggleClass("seleccionado");
		const entrega = Entregas.findOne({ _id: id });
		Session.set("Seleccion", {
			tarea: Tareas.findOne({ _id: entrega.tareaId }),
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
		const asignaturas = profesor.profile.asignaturas;
		const cursosId = asignaturas[asignatura];
		template.cursoId.set(cursosId[0]);
	},
});