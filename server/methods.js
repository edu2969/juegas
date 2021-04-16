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
				docNew.profile.asignaciones = doc.asignaciones;
			}
			Accounts.createUser(docNew);
		}
  },

	// Alumnos
	EnviarDesafio(doc) {
		var docSet = {};
		if(!doc.entregaId) {
			docSet = {
				estudianteId: this.userId,
				desafioId: doc.desafioId,
				fecha: new Date()
			}
			if(doc.kpsis) {
				docSet.kpsis = doc.kpsis;
			}
			Entregas.insert(docSet);
		} else {
			docSet = {
				mejora: true
			}
			if(doc.kpsis) {
				docSet.kpsis = doc.kpsis;
			}
			Entregas.update({
				estudianteId: this.userId,
				desafioId: doc.desafioId
			}, {
				$set: docSet
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
	GuardarDesafio(desafioId, doc) {
		if(desafioId) {
			Desafios.update({ _id: desafioId }, { $set: doc });
			return desafioId;
		} else {
			return Desafios.insert(doc);
		}
	},
	DetallesEliminarDesafio(desafioId) {
		const desafio = Desafios.findOne({ _id: desafioId });
		return {
			fecha: desafio.desde,
			titulo: desafio.titulo,
			entregas: Entregas.find({ desafioId: desafio._id }).count()
		}
	},
	EliminarDesafio(desafioId) {
		Desafios.remove(desafioId);
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
		Object.keys(doc).forEach(function (key) {
			doc[key].forEach(function (registro) {
				console.log("USERNAME: " + registro.rut, key, registro.nombres, registro.apellidos);
				let curso = Cursos.findOne({ curso: key });
				if(!curso) {
					const cursoId = Cursos.insert({ curso: key });
					curso = Cursos.findOne({ _id: cursoId });
				}
				let estudiante = {
					username: registro.rut,
					password: registro.rut.substring(0, 4),
					profile: {
						nombres: registro.nombres,
						apellidos: registro.apellidos,
						rol: 2,
						cursoId: curso._id
					}
				}
				Accounts.createUser(estudiante);
			});
		});
	},


	// TEST
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
			username: "1-1",
			password: "1",
			profile: {
				nombres: "Profe Test",
				apellidos: "Apellidos Ambos",
				asignaciones: {
					"HIST": [],
					"MATE": []
				},
				rol: 3
			}
		}, {
			username: "2-2",
			password: "2",
			profile: {
				nombres: "Profe Dos",
				apellidos: "Test Segundo",
				asignaciones: {
					"INGL": [],
					"CIEN": []
				},
				rol: 3
			}
		}];
		defecto.forEach((u) => {
			Accounts.createUser(u);
		});
	}
})
