var Handlebars = require('handlebars');
module.exports = function(event) {
  if (event.event == 'request') {
    return event.method.toUpperCase() + ' ' + event.path + ' ' + JSON.stringify(event.query) + ' ' + event.statusCode + ' ('+event.responseTime+'ms)';
  }
  if (event.event == 'ops') {

    var requests = [' Requests:'];
    for (var port in event.load.requests) {
      requests.push(event.load.requests[port].total);
      requests.push('('+port+')');
    }

    var responseTimes = [' Response Times:'];
    for (var port in event.load.responseTimes) {
      responseTimes.push(event.load.responseTimes[port].avg);
      responseTimes.push('/')
      responseTimes.push(event.load.responseTimes[port].max);
      responseTimes.push('('+port+')');
    }

    return new Handlebars.SafeString('Load: ' + event.os.load.join(', ') + ' Mem: ' + event.os.mem.free + '/' + event.os.mem.total + '<br/>' + requests.join(' ') + responseTimes.join(' '));
  }
  if (event.data && typeof event.data == 'string') {
    return event.data;
  }
};
