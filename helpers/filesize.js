var humanize = require('humanize');
module.exports = function(input) {
  return humanize.filesize(input);
};
