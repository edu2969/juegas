Handlebars.registerHelper("formatoFecha", function (date, mask) {
	console.log(date, mask);
  if(!date) return '--/--';
  var m = moment(date);
  if (!m) return '--/--';
  if (!mask) mask = 'dd/MM/yyyy';
  return m.format(mask);
});