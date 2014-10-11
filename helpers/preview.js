module.exports = function(event) {
  if (event.event == 'request') {
    return event.method.toUpperCase() + ' ' + event.path + ' ' + JSON.stringify(event.query) + ' ' + event.statusCode + ' ('+event.responseTime+'ms)';
  }
  if (event.data && typeof event.data == 'string') {
    return event.data;
  }
};
