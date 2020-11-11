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
  }
}