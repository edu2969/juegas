var XLSX = Npm.require('xlsx');

Meteor.methods({
	// Alumnos
	EnviarDesafio(tareaId) {
		Entregas.insert({
			alumnoId: this.userId,
			tareaId: tareaId,
			fecha: new Date()
		});
	},
	GuardarEvaluacion(doc) {
		let docSet = {
			evaluacion: doc.evaluacion
		}
		if (doc.comentario) {
			docSet.comentario = doc.comentario;
		}
		Entregas.update({
			_id: doc.entregaId
		}, {
			$set: docSet
		})
	},

	// Profesores
	IngresarTarea(doc) {
		Tareas.insert(doc);
	},
	GuardarTarea(tareaId, doc) {
		if(tareaId) {
			Tareas.update({ _id: tareaId }, { $set: doc });
		} else {
			Tareas.insert(doc);
		}		
	},

	// MISCELANEOS
	uploadS: (bstr, name) => {
		return XLSX.read(bstr, {
			type: 'binary'
		});
	},
	uploadU: (ab, name) => {
		return XLSX.read(ab, {
			type: 'array'
		});
	},

	// Admin
	IngresarAlumnos(doc) {
		console.log("IMPORTANDO ---------------------------------_>");
		console.log(doc);

		Object.keys(doc).forEach(function (key) {
			doc[key].forEach(function (registro) {
				registro.nombres = registro.nombres.map(function(item) {
					return item.charAt(0).toUpperCase() + item.slice(1).toLowerCase();
				});
				registro.apellidos = registro.apellidos.map(function(item) {
					return item.charAt(0).toUpperCase() + item.slice(1).toLowerCase();
				});
				let alumno = {
					username: registro.rut,
					password: registro.rut.substring(0, 4),
					profile: {
						nombres: registro.nombres.join(" ").trim(),
						apellidos: registro.apellidos.join(" ").trim(),
						rol: 2,
						curso: key + "b"
					}
				}					
				Accounts.createUser(alumno);
			});
		});
	},


	// TEST
	_TestTareas() {
		let desde = moment("19/11/2020 08:00", "DD/MM/YYYY HH:mm");
		let hasta = moment("20/11/2020 08:00", "DD/MM/YYYY HH:mm");
		Tareas.insert({
			asignatura: "HIST",
			nivel: "7",
			titulo: "El islam en la edad Media",
			descripcion: "<p>Instrucciones: </p><ul><li>Responde las actividades de acuerdo a lo aprendido en la cápsula.</li><li>Al terminar la evaluación recuerda enviarla al WhatsApp de tu profesor.</li><li>Cualquier duda o consulta lo puedes hacer al WhatsApp de tu profesor.</li></ul><ol><li><p>Según el gráfico de crecimiento de la población en la edad media ¿cuánto es el aumento de la población entre los años 1150 y 1250?<img src='/img/tareas/tarea01.jpeg'></p></li><li>Buscar el significado de:<ul><li>Esperanza de vida: ______________</li><li>Demografía: _____________________</li><li>Tasa de mortalidad: _____________</li></ul></li><li><p>Según la fuente de la pág. 155 de tu texto escolar ¿Quiénes se ven beneficiadas ante las mejoras alimenticias y de qué forma?</p><img src='/img/tareas/tarea02.jpeg'></li><li>Averigüe que factor provoco el descenso demográfico repentino en Europa entre los años 1350 y 1450.</li></ol>",
			desde: desde.toDate(),
			hasta: hasta.toDate(),
			video: "/videos/video01.mp4"
		});
	},
	_DatosIniciales() {
		const defecto = [{
			username: "12973705-0",
			password: "1297",
			profile: {
				nombres: "EdU",
				apellidos: "TroN",
				rol: 1
			}
		}, {
			username: "55555555-5",
			password: "5555",
			profile: {
				nombres: "Alumno Ejemplo",
				apellidos: "Torres Torres",
				rol: 2,
				curso: "7Cb"
			}
		}, {
			username: "17046844-9",
			password: "1704",
			profile: {
				nombres: "Carlos",
				apellidos: "Cruces Grandón",
				asignaturas: ["HIST"],
				rol: 3
			}
		}];
		defecto.forEach((u) => {
			Accounts.createUser(u);
		});
	}
})