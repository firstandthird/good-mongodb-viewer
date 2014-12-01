var MongoClient = require('mongodb').MongoClient;
var Handlebars = require('handlebars');
var monquery = require('monquery');
var Hoek = require('hoek');

var defaults = {
  endpoint: '/logs',
  auth: false,
  collection: 'logs',
  connectionUrl: '',
  limit: 200,
  searches: {
    'Requests': 'event:request',
    'Ops': 'event:ops',
    'Log': 'event:log',
    'Error': 'event:error',
    '4xxs': 'event:request AND statusCode!=200 AND statusCode!=304 AND statusCode!=302 AND statusCode!=500',
    '500s': 'event:request AND statusCode:500'
  }
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
      method: 'GET',
      config: {
        auth: options.auth,
      },
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
      config: {
        auth: options.auth,
      },
      handler: function(request, reply) {

        var collection = db.collection(options.collection);

        var searchQuery = {};
        if (request.query.query) {
          searchQuery = monquery(request.query.query);
        }

        collection.find(searchQuery, { sort: { timestamp: -1 }, limit: options.limit }).toArray(function(err, logs) {
          reply.view('logs', {
            logs: logs,
            query: request.query.query || '',
            endpoint: options.endpoint,
            searches: options.searches
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
