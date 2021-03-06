import { FilesCollection } from "meteor/ostrio:files";

//var HomePath = process.env.PWD ? process.env.PWD : process.cwd();

ImagesEvidencias = new FilesCollection({
  collectionName: "ImagesEvidencias",
  allowClientCode: true,
  storagePath: () => {
    return Meteor.absoluteUrl().indexOf("localhost:3000") != -1
      ? `../../../../../uploads`
      : Meteor.absoluteUrl().indexOf("juegas.cl") != -1
      ? "/home/neo/uploads"
      : "/home/neo/uploads";
  },
  /*transport: Meteor.absoluteUrl().indexOf('localhost:3000') != -1 ? 'http' : 'https',
   */
  onBeforeUpload(file) {
    if (file.size <= 10485760 && /png|jpg|jpeg|gif/i.test(file.extension)) {
      return true;
    }
    return "Por favor, sube imagenes con tamaño menor a 10MB";
  },
});

VideosCapsulas = new FilesCollection({
  collectionName: "VideosCapsulas",
  allowClientCode: true,
  storagePath: () => {
    return Meteor.absoluteUrl().indexOf("localhost:3000") != -1
      ? `../../../../../uploads`
      : Meteor.absoluteUrl().indexOf("juegas.cl") != -1
      ? "/home/neo/uploads"
      : "/home/neo/uploads";
  },
  onBeforeUpload(file) {
    if (file.size <= 83886080 && /mp4/i.test(file.extension)) {
      return true;
    }
    return "Por favor, suba videos MP4 con tamaño menor a 80MB";
  },
});

VideosEvidencias = new FilesCollection({
  collectionName: "VideosEvidencias",
  allowClientCode: true,
  storagePath: () => {
    return Meteor.absoluteUrl().indexOf("localhost:3000") != -1
      ? `../../../../../videoeviidencias`
      : Meteor.absoluteUrl().indexOf("juegas.cl") != -1
      ? "/home/neo/uploads/videoevidencias"
      : "/home/neo/uploads/videoeviidencias";
  },
  onBeforeUpload(file) {
    if (file.size <= 83886080 && /mkv/i.test(file.extension)) {
      return true;
    }
    return "Por favor, suba videos MKV con tamaño menor a 80MB";
  },
});
