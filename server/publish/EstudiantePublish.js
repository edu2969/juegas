export { ImagesEvidencias, VideosCapsulas, VideosEvidencias };

Meteor.publish("estudiante.curso", () => {
  const user = Meteor.user();
  const cursoId = user.profile.cursoId;
  return Cursos.find({ _id: cursoId });
});

Meteor.publishComposite("estudiante.desafios", () => {
  const estudiante = Meteor.user();
  if (estudiante.profile.rol != 2) return;
  const estudianteId = estudiante._id;
  const curso = Cursos.findOne({ _id: estudiante.profile.cursoId });
  const nivel = curso.curso.charAt(0) == "P" ? "PK" : curso.curso.charAt(0);
  return {
    find() {
      return Desafios.find({ nivel: nivel });
    },
    children: [
      {
        find(desafio) {
          return Entregas.find({
            estudianteId: estudianteId,
            desafioId: desafio._id,
          });
        },
      },
      {
        find(desafio) {
          return ImagesEvidencias.find({
            userId: estudianteId,
            "meta.desafioId": desafio._id,
          }).cursor;
        },
      },
      {
        find(desafio) {
          return VideosCapsulas.find({ "meta.desafioId": desafio._id }).cursor;
        },
      },
      {
        find(desafio) {
          return VideosEvidencias.find({ "meta.desafioId": desafio._id })
            .cursor;
        },
      },
    ],
  };
});
