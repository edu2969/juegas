Template.entregas.onCreated(function() {
	this.nivel = new ReactiveVar(false);
});

Template.entregas.rendered = function() {	
	const instance = Template.instance();
	Meteor.subscribe('cursos');
	Tracker.autorun(() => {
		if(!instance.nivel.get()) {
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
			console.log(cursos[0]);
			instance.nivel.set(cursos[0]);
		}
		Meteor.subscribe('curso', instance.nivel.get());
		Meteor.subscribe('desafios');
		Meteor.subscribe('entregasPorNivel', instance.nivel.get());
	});
}

Template.entregas.helpers({
	alumnos() {
		const nivel = Template.instance().nivel.get();
		return Meteor.users.find({ "profile.curso": nivel }).map(function(alumno) {
			var sumatoria = 0;
			var cantidad = 0;
			let entregas = Tareas.find().map(function(tarea) {
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
		const nivel = Template.instance().nivel.get();
		return Tareas.find().map(function(tarea) {
			let entregas = Meteor.users.find({ "profile.curso": nivel })
			return {
				_id: tarea._id,
				fecha: tarea.desde
			}
		})
	},
	cursos() {
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
	"change #curso"(e, template) {
		const nivel = e.currentTarget.value;
		template.nivel.set(nivel);
	}
});