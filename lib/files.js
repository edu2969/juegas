import { FilesCollection } from 'meteor/ostrio:files';

var HomePath = process.env.PWD ? process.env.PWD : process.cwd();

Images = new FilesCollection({
  collectionName: 'Images',
  allowClientCode: true,
  storagePath: () => {
    return Meteor.absoluteUrl().indexOf('localhost:3000') != -1 ?
      `../../../../../uploads` :
      Meteor.absoluteUrl().indexOf('juegas.cl') != -1 ?
      "/home/neo/uploads" : "/home/neo/uploads";
  },
  /*transport: Meteor.absoluteUrl().indexOf('localhost:3000') != -1 ? 'http' : 'https',
   */
  onBeforeUpload(file) {
    if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    }
    return 'Please upload image, with size equal or less than 10MB';
  },
  /*onAfterUpload(fileRef) {
    if (/png|jpe?g/i.test(fileRef.extension || '')) {
      createThumbnails(this, fileRef, (error, fileRef) => {
        if (error) {
          console.error(error);
        }
      });
    }
  }*/
});