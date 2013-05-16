var express = require('express'),
    config   = require('nconf'),
    app     = express();

config.argv().env().file({ file: '../config.json' });

config.defaults({'PORT': 1337, secret: 'default secret.'});
// //
// // Set a few variables on `nconf`.
// //
// config.set('database:host', '127.0.0.1');
// config.set('database:port', 5984);

app.configure(function(){
  app.set('port', config.get('PORT'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.logger('dev'));
  app.use(express.errorHandler());
});

app.get('/', function(req, res, next) {
  res.send({secret: config.get('secret')});
});

app.listen(app.get('port'), function(){
  console.log("Node.js Hosting Test listening on port " + config.get('PORT') + ', running in ' + app.settings.env + " mode.");
});
