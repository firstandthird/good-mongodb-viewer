var MongoClient = require('mongodb').MongoClient;
var Handlebars = require('handlebars');
var monquery = require('monquery');

exports.register = function(plugin, options, next) {

  var endpoint = '/logs';

  var db;
  //TODO: require connectionurl
  //TODO: merge options with defaults

  plugin.path(__dirname);
  plugin.views({
    engines: { 
      html: Handlebars
    },
    path: './views',
    helpersPath: './helpers',
    isCached: false
  });


  plugin.route([
    {
      path: endpoint+'/ui/{path*}',
      method: 'GET',
      handler: {
        directory: {
          path: './public',
          listing: false,
          index: false
        }
      }
    },
    {
      path: endpoint,
      method: 'GET',
      handler: function(request, reply) {

        var collection = db.collection(options.collection);

        var searchQuery = {};
        if (request.query.query) {
          searchQuery = monquery(request.query.query);
        }

        collection.find(searchQuery, { sort: { timestamp: -1 }, limit: 1000 }).toArray(function(err, logs) {
          reply.view('logs', {
            logs: logs,
            query: request.query.query || '',
            endpoint: endpoint
          });
        });
      }
    }
  ]);

  MongoClient.connect(options.connectionUrl, function(err, database) {
    db = database;
    next();
  });

};

exports.register.attributes = {
  name: 'good-mongodb-viewer',
  pkg: require('./package.json')
};
