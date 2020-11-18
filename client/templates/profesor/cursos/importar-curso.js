Template.importarcurso.helpers({
  "change input[type='file']"(event) {
    console.log("ACA!");
    const file = event.currentTarget.files[0];
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = function (e) {
      const data = e.target.result;
      const name = file.name;
      var doc = [];

      Meteor.call(rABS ? 'uploadS' : 'uploadU',
                  rABS ? data : new Uint8Array(data),
                  name,
                  function (err, wb) {
        if (err) throw err;
        const ws = wb.Sheets[wb.SheetNames[0]];
        worksheet = wb.Sheets["paginas"];
        var columnas = ["rut", "nombre"];
        let j = 2;
        while (worksheet["A" + j]) {
          var registro = {};
          for (let i = 0; i < columnas.length; i++) {
            var celda = worksheet[String.fromCharCode(65 + i) + j];
            var valor = (celda ? celda.v : undefined);
            registro[columnas[i]] = valor;
          }
          j++;
          doc.push(registro);
        }
        console.log("DOC: ", doc);
        /*
        Meteor.call("IngresarAlumno", doc, function(err, resp) {
          if(!err) {
            Session.set("MensajesError", {
              exito: [{
                item: "Internacionalización procesada exitosamente"
              }]
            });
            DesvanecerErrores();
          }
        });*/
      });
      $("input[type='file']").val("");
    }
    if (rABS) reader.readAsBinaryString(file);
    else reader.readAsArrayBuffer(file);
  },
})