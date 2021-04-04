Desafios = new Meteor.Collection("desafios");
Desafios.allow({
  insert() {
    return true;
  },
  update() {
    return false;
  },
  remove() {
    return false;
  }
});

Entregas = new Meteor.Collection("entregas");
Entregas.allow({
  insert() {
    return false;
  },
  update() {
    return false;
  },
  remove() {
    return false;
  }
});

Cursos = new Meteor.Collection("cursos");
Cursos.allow({
  insert() {
    return false;
  },
  update() {
    return false;
  },
  remove() {
    return false;
  }
});