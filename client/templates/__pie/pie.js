Template.pie.helpers({
	esProfesor() {
		return Meteor.user() && Meteor.user().profile.rol == 3;
	},
	esAlumno() {
		return Meteor.user() && Meteor.user().profile.rol == 2;
	},
	esAdmin() {
		return Meteor.user() && Meteor.user().profile.rol == 1;
	}
})

Template.pie.events({
  "click .accion:not(.activo)"(e) {
    const ruta = e.currentTarget.attributes["ruta"].value;
		$(".accion").removeClass('activo');
		e.currentTarget.classList.add('activo');
    Router.go(ruta);
  },
  "click .modal .cruz"(e) {
    e.currentTarget.parentElement.parentElement.classList.remove("activo");
  }
});

/*

var width = window.innerWidth;
      var arreglo = [{
        selector: "calorias",
        color: "green",
        valor: 20
      }, {
        selector: "horas",
        color: "red",
        valor: 67
      }, {
        selector: "kilos",
        color: "purple",
        valor: 40
      }];
      arreglo.forEach(function (item) {
        new DashTimer('.graficos .' + item.selector).init({
          height: width / 3 - 16,
          width: width / 3 - 16,
          start: {
            fill: "white"
          },
          finish: {
            fill: item.color
          },
          values: {
            classes: 'texto-central'
          }
        }).setData([{
          immediate: {
            angle: true
          },
          start: {
            angle: 1,
            fill: item.color
          },
          finish: {
            angle: item.valor,
            fill: item.color
          }
        }, {
          values: {
            show: true
          }
        }]).start(1000, 0, item.valor / 100);
      });


      renderMultiTimer();

function renderMultiTimer() {
  var clockOptions = {
    start: {
      fill: "white"
    },
    finish: {
      fill: 'green'
    },
    values: {
      classes: "texto-central",
      styles: "text-anchor:middle;",
      color: 'white',
      show: true
    }
  };

  var timer = new DashTimer('.grafico-solo .resumen')
    .init(clockOptions)
    .setData(getClockData(), {
      values: {
        show: true
      }
    })
    .start(1000, 0.5);
}

function getClockData() {
  return [{
      dataName: "constancia",
      start: {
        angle: 0,
        outerRatio: .7,
        innerRatio: .55,
        fill: '#B3E5FC'
      },
      finish: {
        angle: 0.8,
        outerRatio: .7,
        innerRatio: .55,
        fill: '#B3E5FC'
      }
    }, {
      dataName: "progreso",
      start: {
        angle: 0,
        outerRatio: .85,
        innerRatio: .7,
        fill: '#F0F4C3'
      },
      finish: {
        angle: 0.55,
        outerRatio: .85,
        innerRatio: .7,
        fill: '#F0F4C3'
      }
    }
  ];
}*/