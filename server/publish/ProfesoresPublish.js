export {
  ImagesEvidencias, VideosCapsulas
};

Meteor.publishComposite('profesor.entregas', function() {
	const profesor = Meteor.user();
	if(!profesor || profesor.profile.rol!=3) {
		return false;
	}
	const asignaciones = profesor.profile.asignaciones;
	const cursosIds = [];
	const asignaturas = asignaciones && Object.keys(asignaciones).map(asignatura => {
		asignaciones[asignatura].forEach(cursoId => {
			if(cursosIds.indexOf(cursoId)==-1) {
				cursosIds.push(cursoId);
			}
		});
		return asignatura;
	});
	return {
		find() {
			return Cursos.find({ _id: { $in: cursosIds }});
		},
		children: [{
			find(curso) {
				return Meteor.users.find({ "profile.rol": 2, "profile.cursoId": curso._id });
			}
		}, {
			find(curso) {
				const nivel = curso.curso.charAt(0)=="P" ? "PK" : curso.curso.charAt(0);
				return Desafios.find({ asignatura: { $in: asignaturas }, nivel: nivel });
			},
			children: [{
				find(desafio) {
					return Entregas.find({ desafioId: desafio._id });
				}
			}, {
				find(desafio) {
					return ImagesEvidencias.find({ "meta.desafioId": desafio._id }).cursor;
				}
			}, {
				find(desafio) {
					return VideosCapsulas.find({ "meta.desafioId":desafio._id }).cursor;
				}
			}]
		}]
	}
});

Meteor.publish('profesor.capsulaPendiente', () => {
	return VideosCapsulas.find({
		userId: Meteor.userId(),
		"meta.pendiente": true
	}).cursor;
})
