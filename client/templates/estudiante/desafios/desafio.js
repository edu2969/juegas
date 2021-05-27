export { ImagesEvidencias, VideosCapsulas, VideosEvidencias };

import RecordRTC from "../../../utils/RecordRTC";

const { ASIGNATURAS, EVALUACIONES } = require("../../../../lib/constantes");

var video, currentUpload;

function captureCamera(callback) {
  navigator.mediaDevices
    .getUserMedia({ audio: true, video: true })
    .then(function (camera) {
      callback(camera);
    })
    .catch(function (error) {
      alert("Unable to capture your camera. Please check console logs.");
      console.error(error);
    });
}

var recorder; // globally accessible

function stopRecordingCallback() {
  video.src = video.srcObject = null;
  video.muted = false;
  video.volume = 1;
  const resultado = recorder.getBlob();
  video.src = URL.createObjectURL(resultado);
  recorder.camera.stop();
  recorder.destroy();
  recorder = null;
  var file = new File([resultado], "video-evidencia_01.mkv", {
    type: "video/x-matroska",
  });
  const desafio = Session.get("DesafioSeleccionado");
  const upload = VideosEvidencias.insert(
    {
      file: file,
      chunkSize: "dynamic",
      meta: {
        desafioId: desafio._id,
      },
    },
    false
  );

  upload.on("start", function () {
    currentUpload.set({
      instance: this,
      video: true,
    });
  });

  upload.on("end", function (error, fileObj) {
    if (error) {
      alert("Error during upload: " + error);
    } else {
      //console.log("FileImage", fileObj);
    }
    currentUpload.set(false);
  });
  upload.start();
}

Template.desafio.onCreated(function () {
  currentUpload = new ReactiveVar(false);
});

Template.desafio.rendered = function () {
  video = document.querySelector("#selector-video");
};

Template.desafio.helpers({
  desafio() {
    let desafio = Session.get("DesafioSeleccionado");
    if (!desafio) return;
    let entrega = Entregas.findOne({ desafioId: desafio._id });
    if (!entrega) entrega = {};
    desafio.asignaturaObj = ASIGNATURAS[desafio.asignatura];
    if (desafio.youtube) {
      desafio.youtubeId = desafio.youtube.split("?v=")[1];
    }
    const valoresKpsis = entrega.kpsis ||
      desafio.respuestasKpsis || [-1, -1, -1, -1];
    desafio.kpsis = [
      desafio.kpsi1,
      desafio.kpsi2,
      desafio.kpsi3,
      desafio.kpsi4,
    ].map((kpsi, index) => {
      let resultado = {
        indice: index,
        letra: String.fromCharCode(97 + index),
        valor: kpsi,
      };
      if (valoresKpsis[index] != -1) {
        resultado["seleccionado" + valoresKpsis[index]] = true;
      }
      return resultado;
    });
    return desafio;
  },
  capsula() {
    let desafio = Session.get("DesafioSeleccionado");
    if (!desafio) return;
    let capsula = VideosCapsulas.findOne({ "meta.desafioId": desafio._id });
    return capsula && capsula.link();
  },
  fotos() {
    const desafio = Session.get("DesafioSeleccionado");
    if (!desafio) return;
    return ImagesEvidencias.find({ "meta.desafioId": desafio._id }).map(
      function (foto, index) {
        let img = ImagesEvidencias.findOne({ _id: foto._id });
        let imagen = img && img.link();
        return {
          _id: foto._id,
          imagen: imagen,
          indice: index + 1,
        };
      }
    );
  },
  tieneFotos() {
    let desafio = Session.get("DesafioSeleccionado");
    if (!desafio) return false;
    return ImagesEvidencias.find({ "meta.desafioId": desafio._id }).count();
  },
  videos() {
    const desafio = Session.get("DesafioSeleccionado");
    if (!desafio) return false;
    return VideosEvidencias.find({ "meta.desafioId": desafio._id }).map(
      function (v, index) {
        let ve = VideosEvidencias.findOne({ _id: v._id });
        let src = ve && ve.link();
        return {
          _id: ve._id,
          source: src,
          indice: index + 1,
        };
      }
    );
  },
  entrega() {
    let desafio = Session.get("DesafioSeleccionado");
    if (!desafio) return false;
    var entrega = Entregas.findOne({ desafioId: desafio._id });
    if (!entrega) {
      entrega = {};
    }
    entrega.calificacion = EVALUACIONES[entrega.evaluacion];
    const fechaLimite = moment(desafio.hasta);
    if (
      moment().isBefore(fechaLimite) &&
      (!entrega.calificacion || entrega.calificacion.ponderacion <= 2)
    ) {
      entrega.abierta = true;
    }
    return entrega;
  },
});

Template.desafio.events({
  "click #cruz-desafio"() {
    Session.set("DesafioSeleccionado", {});
    document.querySelector(".contenedor-desafio").classList.toggle("activo");
  },
  "click .btn-enviar-desafio"() {
    let desafio = Session.get("DesafioSeleccionado");
    let doc = {
      desafioId: desafio._id,
    };
    const entrega = Entregas.findOne({
      desafioId: desafio._id,
    });
    if (entrega) {
      doc.entregaId = entrega._id;
    } else {
      doc.kpsis = desafio.respuestasKpsis || [-1, -1, -1, -1];
    }
    console.log("Enviando desafio", doc);
    Meteor.call("EnviarDesafio", doc, function (err, resp) {
      if (!err) {
        Session.set("DesafioSeleccionado", {});
        document
          .querySelector(".contenedor-desafio")
          .classList.toggle("activo");
      }
    });
  },
  "click .marco-foto-evidencia .nombre"(e) {
    let img = ImagesEvidencias.findOne({ _id: e.currentTarget.id });
    Session.set("ImagenSeleccionada", img && img.link());
    document.querySelector(".marco-foto-full").classList.toggle("activo");
  },

  "dragover .camara": function (e, t) {
    e.stopPropagation();
    e.preventDefault();
    t.$(".drop-texto").addClass("activo");
  },
  "dragleave .camara": function (e, t) {
    e.stopPropagation();
    e.preventDefault();
    t.$(".drop-texto").removeClass("activo");
  },
  "dragenter .camara": function (e, t) {
    e.preventDefault();
    e.stopPropagation();
  },
  "drop .camara": function (e, t) {
    e.stopPropagation();
    e.preventDefault();
    var desafio = Session.get("DesafioSeleccionado");
    if (
      e.originalEvent.dataTransfer.files &&
      e.originalEvent.dataTransfer.files[0]
    ) {
      const upload = ImagesEvidencias.insert(
        {
          file: e.originalEvent.dataTransfer.files[0],
          chunkSize: "dynamic",
          meta: {
            desafioId: desafio._id,
          },
        },
        false
      );

      upload.on("start", function () {
        currentUpload.set({
          instance: this,
          imagen: true,
        });
      });

      upload.on("end", function (error, fileObj) {
        if (error) {
          alert("Error during upload: " + error);
        } else {
          //console.log("FileImage", fileObj);
        }
        currentUpload.set(false);
        t.$(".drop-texto").removeClass("activo");
      });
      upload.start();
    }
  },
  "click .camara"(e) {
    $("#upload-image").click();
  },
  "change #upload-image"(e, template) {
    var desafio = Session.get("DesafioSeleccionado");
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      const upload = ImagesEvidencias.insert(
        {
          file: e.currentTarget.files[0],
          chunkSize: "dynamic",
          meta: {
            desafioId: desafio._id,
          },
        },
        false
      );

      upload.on("start", function () {
        currentUpload.set({
          instance: this,
          imagen: true,
        });
      });

      upload.on("end", function (error, fileObj) {
        currentUpload.set(false);
        $("#upload-image").removeClass("activo");
      });

      upload.start();
    }
  },
  "click .eliminar-foto-evidencia"(e) {
    ImagesEvidencias.remove({ _id: e.currentTarget.id });
  },
  "click .numero"(e, template) {
    const numero = e.currentTarget.innerHTML;
    const indice = e.currentTarget.parentElement.id;
    let desafio = Session.get("DesafioSeleccionado");
    if (!desafio.respuestasKpsis) {
      desafio.respuestasKpsis = [-1, -1, -1, -1];
    }
    desafio.respuestasKpsis[indice] = numero;
    Session.set("DesafioSeleccionado", desafio);
  },

  "click .videocamara, click #cruz-video"(e) {
    console.log("Se apreto aca", e.currentTarget);
    $(".marco-boton").show();
    $(".marco-video").toggleClass("activo");
  },
  "click #btn-start-recording"(e, template) {
    captureCamera(function (camera) {
      video.muted = true;
      video.volume = 0;
      video.srcObject = camera;

      recorder = RecordRTC(camera, {
        type: "video",
        mimeType: "video/webm;codecs=h264",
        getNativeBlob: true,
      });

      recorder.startRecording();

      // release camera on stopRecording
      recorder.camera = camera;

      $("#btn-start-recording").hide();
      $("#btn-stop-recording").show();
    });
  },
  "click .eliminar-video-evidencia"(e) {
    VideosEvidencias.remove({ _id: e.currentTarget.id });
  },
  "click #btn-stop-recording"(e, template) {
    $("#btn-stop-recording").hide();
    $("#btn-start-recording").show();
    recorder.stopRecording(stopRecordingCallback);
  },
  "click .nombre-video"(e, template) {
    const id = e.currentTarget.id;
    const videoEvidencia = VideosEvidencias.findOne({ _id: id });
    document.getElementById("selector-video").src = videoEvidencia.link();
    $(".marco-boton").hide();
    $(".marco-video").toggleClass("activo");
  },
});
