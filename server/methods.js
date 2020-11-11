Meteor.methods({
	Tareas() {
		return Tareas.find();
	},
	Entregas() {
		return Entregas.find({ userId: this.userId });
	},
	
	_TestTareas() {
		let desde = moment().startOf("day").hour(10);
		let hasta = moment(desde).add(2, "days").hour(18);
		Tareas.insert({
			asignatura: "HIST",
			nivel: "7b",
			titulo: "Arturo Prat contra el Huáscar",
			descripcion: "A partir de la explicación del profesor, elaborar un trabajo que incluya una portada y su contenido, relatando tu versión de la caída del imperio Arcano, dibuja un recuadro de la vida de los pueblos en su apogeo. Finalmente, fotografía cada hoja y envíala.",
			desde: desde.toDate(),
			hasta: hasta.toDate(),
			url: "https://www.youtube.com/embed/vrziuvvARhU?autoplay=1"
		});
	}
})