var XLSX = Npm.require('xlsx');

Meteor.methods({
	// Core
	ActualizarCuenta(doc) {
		// Actualizando
		if(doc._id) {
			let docSet = {};
			if(doc.username) {
				docSet.username = doc.username;
				delete doc.username;
			}
			let id = doc._id;
			delete doc._id;
			let password;
			if(doc.password) {
				password = doc.password;
				delete doc.password;
			}
			Object.keys(doc).forEach((key) => {
				let valor = doc[key];
				docSet["profile." + key] = valor;
			});
			Meteor.users.update({
				_id: id
			}, { $set: docSet });
			if(password) {
				Accounts.setPassword(id, password);
			}
		} else { // Nuevo
			let docNew = {
				username: doc.username,
				password: doc.password,
				profile: {
					nombres: doc.nombres,
					apellidos: doc.apellidos,
					rol: doc.perfil
				}
			};
			if(profile.rol==3) {
				docNew.profile.asignaturas = doc.asignaturas;
			}
			Accounts.createUser(docNew);			
		}
  },
	
	// Alumnos
	EnviarDesafio(doc) {
		if(!doc.entregaId) {
			Entregas.insert({
				alumnoId: this.userId,
				tareaId: doc.desafioId,
				fecha: new Date()
			});
		} else {
			Entregas.update({
				alumnoId: this.userId,
				tareaId: doc.desafioId
			}, {
				$set: {
					mejora: true
				}
			});
		}
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
	GuardarTarea(tareaId, doc) {
		if(tareaId) {
			Tareas.update({ _id: tareaId }, { $set: doc });
			return tareaId;
		} else {
			let profesor = Meteor.user();
			doc.asignatura = profesor.profile.asignaturas[0];
			return Tareas.insert(doc);
		}		
	},
	DetallesEliminarTarea(tareaId) {
		const tarea = Tareas.findOne({ _id: tareaId });
		return {
			fecha: tarea.desde,
			titulo: tarea.titulo,
			entregas: Entregas.find({ tareaId: tarea._id }).count()
		}
	},
	EliminarTarea(tareaId) {
		Tareas.remove(tareaId);
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
				console.log("USERNAME: " + registro.rut, key, registro.nombres.join(" ").trim(), registro.apellidos.join(" ").trim());
				let curso = Cursos.findOne({ nivel: key });
				if(!curso) {
					const cursoId = Cursos.insert({ nivel: key });
					curso = Cursos.findOne({ _id: cursoId });
				}
				let alumno = {
					username: registro.rut,
					password: registro.rut.substring(0, 4),
					profile: {
						nombres: registro.nombres.join(" ").trim(),
						apellidos: registro.apellidos.join(" ").trim(),
						rol: 2,
						curso: curso._id
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
			username: "11111111-1",
			password: "1111",
			profile: {
				nombres: "Profe Test",
				apellidos: "Apellidos Ambos",
				asignaturas: { 
					"HIST": ["7GLNXrzttrRmHzoYN", "heWkGc5CBK5xfvpxQ", "5G8fyb55eyzS3mM7b"], 
					"MATH": [] 
				},
				rol: 3
			}
		}];
		defecto.forEach((u) => {
			Accounts.createUser(u);
		});
	}
})