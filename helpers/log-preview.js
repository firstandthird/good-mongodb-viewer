module.exports = function(input) {

  var max = 1000;
  var truncate = function(obj) {
    for (var prop in obj) {
      if(obj.hasOwnProperty(prop)) {
        var val = obj[prop];
        if (typeof val == 'object') {
          truncate(obj[prop]);
        } else if (typeof val === 'string' && val.length > max) {
          obj[prop] = val.substr(0, max) + '...';
        }
      }
    }
  };

  truncate(input);
  return JSON.stringify(input, null, '  ');
};
