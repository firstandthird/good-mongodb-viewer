module.exports = function(input, pretty) {
  var spaces = (pretty) ? '  ' : '';
  return JSON.stringify(input, null, spaces);
};
