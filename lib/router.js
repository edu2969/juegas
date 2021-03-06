Router.configure({
	layoutTemplate: 'app',
	onBeforeAction: function(){
		if ( Meteor.userId() ){
			this.next();
		} else this.render('/login');
	}
});

Router.route('/', {
	template: '/login',
	action() {
		this.render();	
	}	
});

Router.route('/cuentas', {
  path: '/cuentas/:tipo',
  template: 'cuentas',
	layoutTemplate: 'app',
	waitOn() {
		return [
			Meteor.subscribe('cursos.listado'),
			Meteor.subscribe('usuarios.cuentas', this.params.tipo)
		]
	},
  action() {
    this.render();
  }
});

Router.route('/desafios', {
	waitOn() {
		return [
			Meteor.subscribe('estudiante.curso'),
			Meteor.subscribe('estudiante.desafios')
		]
	}
});

Router.route('/entregas', {
	waitOn() {
		return [
			Meteor.subscribe('profesor.entregas'),
			Meteor.subscribe('profesor.capsulaPendiente')
		]
	},
	action() {
		this.render();
	}
});

Router.route('/importar-cursos', {
	template: '/importarcursos'
});

Router.route('/configuraciones');
