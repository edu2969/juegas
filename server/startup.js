import {
	Meteor
} from 'meteor/meteor';

Meteor.startup(() => {
	if (!Meteor.users.find().count()) {
		const defecto = [{
			username: "12973705-0",
			password: "1297",
			profile: {
				nombres: "EdU",
				apellidos: "TroN",
				rol: 1
			}
		}, {
			username: "111111111-1",
			password: "1111",
			profile: {
				nombres: "Carlos",
				apellidos: "Cruces Grandón",
				asignaturas: ["HIST"],
				rol: 3
			}
		}, {
			username: "22222222-2",
			password: "2222",
			profile: {
				nombres: "Alejandra María",
				apellidos: "Pilar Gómez",
				rol: 2
			}
		}, {
			username: "33333333-3",
			password: "3333",
			profile: {
				nombres: "Marco Antonio",
				apellidos: "Córdova Hualikún",
				rol: 2
			}
		}];
		defecto.forEach((u) => {
			Accounts.createUser(u);
		});
	}
});