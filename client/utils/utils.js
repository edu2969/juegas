IsEmpty = (valor) => {
	return Object.keys(valor).length === 0 && valor.constructor === Object
}

UIUtils = {
  toggleVisible: (global, selector) => {  
    var elementos = document.querySelectorAll("." + global);
    for(var i=0; i < elementos.length; i++) {
      elementos[i].style.display = 'none';
    }  
    document.querySelector("." + global + "." + selector)
      .style.display = 'block';
  },
  toggleClass: (global, selector, clase) => {
    var elementos = document.querySelectorAll("." + global);
    for(var i=0; i < elementos.length; i++) {
      elementos[i]
        .classList
        .remove(clase);
    }  
    document
      .querySelector("." + global + "." + selector)
      .classList
      .add(clase);
  },
	toggle: (selector, clase) => {
		var elementos = document.querySelectorAll("." + selector);
    for(var i=0; i < elementos.length; i++) {
      elementos[i]
        .classList
        .toggle(clase);
    }
	}
}