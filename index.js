var MongoClient = require('mongodb').MongoClient;
var Handlebars = require('handlebars');
var monquery = require('monquery');
var Hoek = require('hoek');

var defaults = {
  endpoint: '/logs',
  auth: false,
  connectionUrl: ''
};

exports.register = function(plugin, options, next) {

  options = Hoek.applyToDefaults(defaults, options);

  if (!options.connectionUrl) {
    return next('connectionUrl is required');
  }

  var db;

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
      path: options.endpoint+'/ui/{path*}',
      auth: options.auth,
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
      path: options.endpoint,
      method: 'GET',
      auth: options.auth,
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
            endpoint: options.endpoint
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
