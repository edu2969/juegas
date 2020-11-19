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
		let desde = moment().startOf("day").hour(10);
		let hasta = moment(desde).add(2, "days").hour(18);
		Tareas.insert({
			asignatura: "HIST",
			nivel: "7",
			titulo: "Arturo Prat contra el Huáscar",
			descripcion: "A partir de la explicación del profesor, elaborar un trabajo que incluya una portada y su contenido, relatando tu versión de la caída del imperio Arcano, dibuja un recuadro de la vida de los pueblos en su apogeo. Finalmente, fotografía cada hoja y envíala.",
			desde: desde.toDate(),
			hasta: hasta.toDate(),
			url: "https://www.youtube.com/embed/vrziuvvARhU?autoplay=1"
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