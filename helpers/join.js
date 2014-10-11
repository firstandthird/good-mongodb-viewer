module.exports = function(input, joinChar) {
  if (!input) {
    return;
  }
  return input.join(joinChar);
};
