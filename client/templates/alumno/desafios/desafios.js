const inicializarYoutube = function() {
	var videos = document.getElementsByClassName("youtube"); 

	for (var i=0; i<videos.length; i++) {

		var youtube = videos[i];

		// Based on the YouTube ID, we can easily find the thumbnail image
		var img = document.createElement("img");
		img.setAttribute("src", "http://i.ytimg.com/vi/" 
														+ youtube.id + "/hqdefault.jpg");
		img.setAttribute("class", "thumb");


		// Overlay the Play icon to make it look like a video player
		var circle = document.createElement("div");
		circle.setAttribute("class","circle");  

		youtube.appendChild(img);
		youtube.appendChild(circle);

		// Attach an onclick event to the YouTube Thumbnail
		youtube.onclick = function() {

			// Create an iFrame with autoplay set to true
			var iframe = document.createElement("iframe");
			iframe.setAttribute("src",
						"https://www.youtube.com/embed/" + this.id 
					+ "?autoplay=1&autohide=1&border=0&wmode=opaque&enablejsapi=1"); 

			// The height and width of the iFrame should be the same as parent
			iframe.style.width  = this.style.width;
			iframe.style.height = this.style.height;

			// Replace the YouTube thumbnail with YouTube HTML5 Player
			this.parentNode.replaceChild(iframe, this);

		}; 
	}
}

Template.desafios.rendered = function() {		
	Tracker.autorun(() => {
		Meteor.subscribe('desafios');
		Meteor.subscribe('entregas');
	});
	Session.set("DesafioSeleccionado", false);
}

Template.desafios.helpers({
	desafios() {
		var desafios = Tareas.find();
		return desafios.map(function(desafio) {
			let entrega = Entregas.findOne({ tareaId: desafio._id });
			if(entrega) {
				desafio.color = entrega && entrega.comentado ? "amarillo" : "verde";
				desafio.icono = ( entrega && entrega.evaluacion ) ? EVALUACIONES[entrega.evaluacion].icono : "hourglass_top";				
				if(entrega.comentario) {
					desafio.comentario = entrega.comentario;
				}
			} else {
				desafio.color = "rojo";
				desafio.icono = "remove_circle";
			}
			return desafio;
		});
	},
	stats() {
		return {
			entregas: Entregas.find().count(),
			total: Tareas.find().count()
		}
	}
})

Template.desafios.events({
  "click .btn-contactar-profesor"() {
    document.querySelector("#modalconsultarprofesor")
      .classList.add("activo");
  },
	"click .barra"(e) {
		const id = e.currentTarget.id;
		const desafio = Tareas.findOne({ _id: id });
		$("iframe").remove();
		Session.set("DesafioSeleccionado", desafio);
    document.querySelector(".contenedor-desafio").classList.toggle("activo");
		if(desafio.youtube) {
			setTimeout(function() {
				inicializarYoutube();	
			}, 1000);			
		}
	}
});