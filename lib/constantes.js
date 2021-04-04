const VERSION = "0.98";

const PERFILES = ["admin", "alumno", "profesor", "director"];

const ASIGNATURAS = {
	"HIST": {
		icon: "history_edu",
		label: "Historia"
	},
	"MATE": {
		icon: "calculate",
		label: "Matemáticas"
	},
	"INGL": {
		icon: "closed_caption",
		label: "Inglés"
	},
	"CIEN": {
		icon: "science",
		label: "Ciencias"
	},
	"ORIE": {
		icon: "explore",
		label: "Orientación"
	},
	"MUSI": {
		icon: "music_note",
		label: "Música"
	},
	"RELI": {
		icon: "add_location",
		label: "Religión"
	},
	"TECH": {
		icon: "memory",
		label: "Tecnología"
	},
	"LENG": {
		icon: "language",
		label: "Lenguaje"
	}
}

const EVALUACIONES = {
	"EX": {
		icono: 'military_tech',
		color: 'rgb(187,211,158)',
		etiqueta: 'Excelente',
		ponderacion: 5
	},
	"MB": {
		icono: 'stars',
		color: 'rgb(41,175,188)',
		etiqueta: 'Muy Bien',
		ponderacion: 4
	},
	"BI": {
		icono: 'check_circle',
		color: 'rgb(152,133,181)',
		etiqueta: 'Bien',
		ponderacion: 3
	},
	"ME": {
		icono: 'feedback',
		color: 'rgb(206,130,174)',
		etiqueta: 'Mejorable',
		ponderacion: 2
	},
	"SR": {
		icono: 'remove_circle',
		color: 'rgb(232,106,47)',
		etiqueta: 'Sin realizar',
		ponderacion: 1
	},
	"OK": {
		icono: 'notifications_paused',
		color: 'lightgray',
		etiqueta: 'Sin revisar',
		ponderacion: -1
	}
}

const CALIFICACIONES = {
	"A": {
		colores: ["187,211,158", "221,232,201"],
		glosa: "El estudiante muestra un grado lo logro alto",
		aprueba(valor) {
			return valor >= 0.86;
		}
	},
	"B": {
		colores: ["41,175,188", "157,219,224"],
		glosa: "El estudiante muestra un grado lo logro adecuado",
		aprueba(valor) {
			return valor >= 0.71 && valor < 0.86;
		}
	},
	"C": {
		colores: ["152,133,181", "210,198,224"],
		glosa: "El estudiante puede realizar un mayor progreso de su aprendizaje",
		aprueba(valor) {
			return valor >= 0.60 && valor < 0.71;
		}
	},
	"D": {
		colores: ["206,130,174", "234,208,224"],
		glosa: "El estudiante requiere apoyo específico para alcanzar un mayor grado de aprendizaje",
		aprueba(valor) {
			return valor && valor < 0.60;
		}
	},
	"E": {
		colores: ["232,106,47", "242,212,207"],
		glosa: "Sin información. No existe evidencia del estudiante para reportar su aprendizaje",
		aprueba(valor) {
			return !valor;
		}
	}
}

module.exports = {
	VERSION,
	PERFILES,
	ASIGNATURAS,
	EVALUACIONES,
	CALIFICACIONES
}