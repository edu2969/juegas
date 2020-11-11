Meteor.publish('desafios', function() {
	return Tareas.find();
});

Meteor.publish('profesores', function() {
	return Meteor.users.find({ "profile.rol": 3 });
});

Meteor.publish('entregas', function() {
	const alumnoId = this.userId();
	return Entregas.find({ alumnoId: alumnoId });
});

Meteor.publish('alumnos', function() {
	if(Meteor.user().profile.rol!=3) {
		return false;
	}
	const profesorId = Meteor.userId();
	// @TODO se trae solo el curso
	return Meteor.users.find({ "profile.rol": 2 });
})