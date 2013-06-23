require('nodefly').profile(
    'bde5e07e-1a81-4f6e-a9fd-c6ac2c3f1357',
    ['NODE PaaS TEST', 'openshift'],
    {blockThreshold: 10}
);

var express = require('express'),
    config   = require('nconf'),
    app     = express();

config.argv().env().file({ file: '../config.json' });
//config.defaults({'PORT': 1337, SECRET: 'default secret.'});
config.defaults({'PORT': process.env.OPENSHIFT_INTERNAL_PORT || 8080, SECRET: 'default secret.'});
var ipaddr  = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";

app.configure(function(){
  app.set('port', config.get('PORT'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.logger('dev'));
  app.use(express.errorHandler());
});

app.get('/', function(req, res) {
  {secret: config.get('SECRET')}
});

app.get('/block/:n', function(req, res){
  var blockres = fibonacci(parseInt(req.param('n'), 10));
  res.send("done: " + blockres);
});

app.listen(app.get('port'), function(){
  console.log("Node.js Hosting Test listening on port " + config.get('PORT') + ', running in ' + app.settings.env + " mode, Node version is: " + process.version);
});

function fibonacci(n) {
  if (n < 2)
    return 1;
  else
    return fibonacci(n-2) + fibonacci(n-1);
}

