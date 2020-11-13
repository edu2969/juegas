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
			username: "11111111-1",
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
				rol: 2,
				curso: "7Ab"
			}
		}, {
			username: "33333333-3",
			password: "3333",
			profile: {
				nombres: "Marco Antonio",
				apellidos: "Córdova Hualikún",
				rol: 2,
				curso: "7Ab"
			}
		}, {
			username: "44444444-4",
			password: "4444",
			profile: {
				nombres: "Marquiño Maxi",
				apellidos: "Flores Leal",
				rol: 2,
				curso: "7Bb"
			}
		}, {
			username: "55555555-5",
			password: "5555",
			profile: {
				nombres: "Marta Elena",
				apellidos: "Mendoza Villablanca",
				rol: 2,
				curso: "7Bb"
			}
		}, {
			username: "66666666-6",
			password: "6666",
			profile: {
				nombres: "Fridrick Alonso",
				apellidos: "Crimsson Pasteur",
				rol: 2,
				curso: "7Cb"
			}
		}, {
			username: "77777777-7",
			password: "7777",
			profile: {
				nombres: "Fafaella Elizabeth",
				apellidos: "Cruces Muñoz",
				rol: 2,
				curso: "7Cb"
			}
		}];
		defecto.forEach((u) => {
			Accounts.createUser(u);
		});
	}
});