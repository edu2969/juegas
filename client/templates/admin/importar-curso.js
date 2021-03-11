Template.importarcurso.events({
  "change input[type='file']"(event) {
    const file = event.currentTarget.files[0];
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = function (e) {
      const data = e.target.result;
      const name = file.name;
      var doc = {};
			var cursos = {};

      Meteor.call(rABS ? 'uploadS' : 'uploadU',
                  rABS ? data : new Uint8Array(data),
                  name,
                  function (err, wb) {
        if (err) throw err;
				for(let curso = 0; curso < wb.SheetNames.length; curso++ ) {
					const ws = wb.Sheets[wb.SheetNames[curso]];
					var columnas = ["numero", "rut", "nombres"];
					let j = 6;
					var registros = [];
					let etiqueta = wb.SheetNames[curso];
					let nivel = etiqueta.split("° ")[0];
					let numero = etiqueta.split("° ")[1];
					const nombreCurso = nivel + numero;
					cursos[nombreCurso] = [];
					while (ws["B" + j]) {
						var rut = ws["C" + j].v;
						var nombreCompleto = ws["D" + j].v.trim().split(" ");
						var nombres = nombreCompleto.slice(2, nombreCompleto.length);
						var apellidos = nombreCompleto.slice(0, 2);
						cursos[nombreCurso].push({
							rut: rut, 
							nombres: nombres, 
							apellidos: apellidos
						})
						j++;						
					}
					doc[nombreCurso] = cursos[nombreCurso];
				}
				
				console.log(doc);

				Meteor.call("IngresarAlumnos", doc, function(err, resp) {
          if(!err) {
            console.log("TODO CORRECTO!");
          } else {
						console.log("UPS... algo malo ocurrio", err);
					}
        });
      });
      $("input[type='file']").val("");
    }
    if (rABS) reader.readAsBinaryString(file);
    else reader.readAsArrayBuffer(file);
  },
})