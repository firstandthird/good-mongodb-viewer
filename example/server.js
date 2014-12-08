var Good = require('good');
var Hapi = require('hapi');
var GoodMongoDb = require('good-mongodb');

var server = new Hapi.Server(8080, '0.0.0.0', {
  debug: {
    request: ['error']
  }
});

var mongoUrl = 'mongodb://localhost:27017/good-mongodb';
var goodOptions = {
  //extendedRequests: true,
  //opsInterval: 5000,
  reporters: [{
      reporter: Good.GoodConsole,
      args: [{
        events: {
          //ops: '*',
          request: '*',
          log: '*',
          error: '*'
        }
      }]
    },
    {
      reporter: GoodMongoDb,
      args: [mongoUrl, {
        events: {
          ops: '*',
          request: '*',
          log: '*',
          error: '*'
        }
      }]
    }
  ]
};

server.pack.register([
  { plugin: Good, options: goodOptions },
  { plugin: require('../'), options: {
    collection: 'logs',
    connectionUrl: mongoUrl,
    searches: {
      'Server Start': 'tags:server'
    }
  }}
], function (err) {

   if (err) {
      console.log(err);
      return;
   }

   server.route([
     {
       method: 'GET', 
       path: '/error', 
       handler: function(request, reply) {
         var collection = request.server.plugins['good-mongodb-viewer'].collection;

         collection.find({}, {limit: 1}).toArray(function(err, data) {
          console.log(data);
         });

         reply(Hapi.error.badRequest('bad bad bad'));
       }
     }
   ]);

   server.start(function() {
     server.log(['log', 'server'], 'Hapi server started '+ server.info.uri);
   });

});
