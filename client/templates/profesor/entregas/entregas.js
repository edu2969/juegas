Template.entregas.events({
	"click th.rotated"(e) {
		const id = e.currentTarget.id;
		//const tarea = Tareas.findOne({ _id: id });
		//Session.set("TareaSeleccionada", desafio);
    document.querySelector(".contenedor-tarea").classList.toggle("activo");
	},
	"click td"(e) {
		const id = e.currentTarget.id;
		//const tarea = Tareas.findOne({ _id: id });
		//Session.set("TareaSeleccionada", desafio);
    document.querySelector(".contenedor-revision").classList.toggle("activo");
	}
})