var Handlebars = require('handlebars');
module.exports = function(input, pretty) {
  var spaces = (pretty) ? '  ' : '';
  return new Handlebars.SafeString(JSON.stringify(input, null, spaces));
};
