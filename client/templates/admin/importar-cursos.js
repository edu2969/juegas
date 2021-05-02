Template.importarcursos.events({
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
					let j = 5;
					var registros = [];
					let etiqueta = wb.SheetNames[curso];
					let nivel = etiqueta.split("° ")[0];
					let numero = etiqueta.split("° ")[1];
					const nombreCurso = nivel + numero;
					cursos[nombreCurso] = [];
          console.log("Procesando curso", nombreCurso);
					while (ws["B" + j]) {
            var rut = ws["C" + j].v;
						var nombreCompleto = ws["D" + j].v;
						var partes = nombreCompleto.split(" ");
						var apellidos = partes[0] + " " + partes[1];
						if(partes[0]=="SAN" || partes[1]=="SAN") {
							apellidos += partes[2] + " ";
						}
						apellidos = apellidos.trim();
						var nombres = nombreCompleto.substr(apellidos.length + 1).trim();
            console.log("Procesando alumno", rut, "[" + nombres + "/" + apellidos + "]");
						cursos[nombreCurso].push({
							rut: rut.trim().replace(/\./g, ''),
							nombres: nombres.trim(),
							apellidos: apellidos.trim()
						})
						j++;
					}
					doc[nombreCurso] = cursos[nombreCurso];
				}

        console.log("Se ha procesao del excel:", doc);
				Meteor.call("IngresarAlumnos", doc, function(err, resp) {
          if(!err) {
						console.log("Todo correcto....!");
					} else {
            console.error(err);
					}
        });
      });
      $("input[type='file']").val("");
    }
    if (rABS) reader.readAsBinaryString(file);
    else reader.readAsArrayBuffer(file);
  },
})
