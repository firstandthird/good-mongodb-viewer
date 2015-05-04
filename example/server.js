var Good = require('good');
var Hapi = require('hapi');
var GoodMongoDb = require('good-mongodb');
var Boom = require('boom');

var server = new Hapi.Server({
  //debug: {
    //request: ['error']
  //}
});
server.connection({
  port: 8080
});

var mongoUrl = 'mongodb://localhost:27017/good-mongodb';
var goodOptions = {
  //extendedRequests: true,
  //opsInterval: 5000,
  reporters: [{
      reporter: require('good-console'),
      events: {
        //ops: '*',
        response: '*',
        log: '*',
        error: '*'
      }
    },
    {
      reporter: GoodMongoDb,
      config: {
        connectionUrl: mongoUrl,
        ttl: 60*5
      },
      events: {
        //ops: '*',
        response: '*',
        log: '*',
        error: '*'
      }
    }
  ]
};

server.register([
  { register: Good, options: goodOptions },
  { register: require('../'), options: {
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
       path: '/',
       handler: function(request, reply) {
         reply('go to /logs to view logs');
       }
     },
     {
       method: 'GET',
       path: '/html',
       handler: function(request, reply) {
         server.log(['html'], { data: { email: '<h1>Hi Bob</h1>' }});
         reply('ok');
       }
     },
     {
       method: 'GET', 
       path: '/error', 
       handler: function(request, reply) {
         var collection = request.server.plugins['good-mongodb-viewer'].collection;

         collection.find({}, {limit: 1}).toArray(function(err, data) {
          console.log(data);
         });

         reply(Boom.badRequest('bad bad bad'));
       }
     },
     {
       method: 'GET',
       path: '/crash',
       handler: function(request, reply) {
         var test = {};
         reply(test.user.email);
       }
     }
   ]);

   server.start(function() {
     server.log(['log', 'server'], 'Hapi server started '+ server.info.uri);
   });

});
