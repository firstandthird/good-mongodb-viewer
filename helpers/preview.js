var Handlebars = require('handlebars');
module.exports = function(input) {

  if (input.response) {
    if (input.response.message) {
      return input.response.message;
    }
    if (input.response.context && input.response.context.message) {
      return input.response.context.message;
    }
  }

  return new Handlebars.SafeString(JSON.stringify(input, null, ''));
};
