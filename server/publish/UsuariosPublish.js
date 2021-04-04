const { PERFILES } = require('../../lib/constantes');

Meteor.publish('usuarios.cuentas', function(tipo) {
	const rol = PERFILES.indexOf(tipo) + 1;
	if(!rol) return false;
	return Meteor.users.find({ "profile.rol": rol });
});