Meteor.publish('cursos.listado', () => {
	return Cursos.find();
});