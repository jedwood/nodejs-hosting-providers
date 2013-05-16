Node.js Hosting PaaS Providers
---

>A comparison as of of May 2013

Node.js may still be young relative to its counterparts, but when it comes to hosting there are a lot of options. In this post we'll take a look at several "Platform as a Service" providers.

I'm not including "Infrustructure as a Service" options like [AWS](http://aws.amazon.com) and [Joyent](http://joyent.com), although ironically I have much more personal experience with both of those than any provider on this list.

In this round, I'm primarily looking at two aspects: *deploying* and *configuring* environment variables. I'll also include some notes about getting started, some screenshots of dashboards, and other miscelaneous observations.

## The Setup

Here's the simple app we're going to be using as a test base.

        var express = require('express'),
            config   = require('nconf'),
            app     = express();

        config.argv().env().file({ file: '../config.json' });
        config.defaults({'PORT': 1337, SECRET: 'default secret.'});

        app.configure(function(){
          app.set('port', config.get('PORT'));
          app.use(express.bodyParser());
          app.use(express.methodOverride());
          app.use(app.router);
          app.use(express.logger('dev'));
          app.use(express.errorHandler());
        });

        app.get('/', function(req, res, next) {
          res.send({secret: config.get('SECRET')});
        });

        app.listen(app.get('port'), function(){
          console.log("Node.js Hosting Test listening on port " + config.get('PORT') + ', running in ' + app.settings.env + " mode, Node version is: " + process.version);
        });


I'm using [nconf](https://github.com/flatiron/nconf) to elegantly handle the varying ways that we'll be specifying the port our app should listen to (sometimes required) and a dummy variable I'm calling `SECRET.` When I load the app, I'll be able to tell if our variables are being correctly pulled from some external source. If not, the response I get back when I load the app will be `default secret`. I should also be able to see what port the app is listening on an the `NODE_ENV` it's using if I can access the logs from the startup of the app.

And now in no particular order...

## Nodejitsu
https://www.nodejitsu.com/

One of the original players and still purely a Node.js solution, Nodejitsu became an official partner of Joyent's back when Joyent [dropped their no.de service](http://joyent.com/no-de) (shame, it was such an awesome domain name). Nodejitsu no longer has a permanently free tier, but individual plans start at a paltry $3 a month and there's a 30-day free trial.

#### Deploying
Pushing your code to the Nodejitsu cloud is done via a custom command-line tool, installed with npm.
- requires a "subdomain" property in the package.json, but friendly prompt to add it
- auto-increments the "version" in package.json on each deploy
- plans start at $3 a month
- proper WebSocket support
- mongoHQ or mongolab
- IrisRedis
- still only running 0.8.19. Unexpected because it claims "info: Welcome to Nodejitsu jedwood
info:    jitsu v0.12.10-2, node v0.10.4"
- keep it running "Nodejitsu's cloud services watch your programs for you! You shouldn't have to do anything special to keep your apps running"
- doesn't matter what you set the port to, as long as it's either 80 or greater than 1024. Things get proxied through 80 of course.
- logs via jitsu logs
- totally subjective unscientific feel: very snappy to deploy and view logs
- predeploy and postdeploy hooks configured in package.json
- when I changed the "name" in my package.json, it wouldn't let me deploy to that same app


### Heroku
- supports 0.10.6 as of May 16. Nice!
- also has a CLI, but deployment via git
- git remote add heroku git@heroku.com:jedwoodtest.git
- must be on port 5000
- no proper WebSocket support
- got a little hung up on not including "heroku ps:scale web=1" should have been more clear when first creating/deploying
- subjective- dashboard really nice, with features like pointing 404 pages to an S3 bucket and transfering app ownership (very handy when doing client work )
- request timeout of 30 seconds
- free
- heroku logs


### Modulus
- $15 a month
- MongoDB on board
- cli, non-git. ZIPS and uploads your entire app every time.
- DB $5.00/GB/MONTH 64MB FREE. $1.00/GB/MONTH 1GB FREE.
- 8080 but we recommend using the PORT environment variable (process.env.PORT).
- weird that I couldn't use spaces in the value of my ENV variable. tripped me up
- ignores engine and runs on 0.8.15
- `modulus project logs`

### AppFog
- Mongo on board
- v 0.8.14, ignores package.json
- CLI deploy (installed as a Ruby gem)
- Free, first paid tier is $20/mo
- up to 8 instances across 2GB of RAM, split however you want
- Use of non-standard "process.env.VCAP_APP_PORT", but I just used my default and it works: 57277
- let's you choose which cloud (AWS in multiple regions, HP, Azure)
- `af logs jedwood`

### Windows Azure
- Sign up a little more involved: verify SMS, enter billing creds, Windows Live login
- CLI for config (optional, installed via npm), git for deploy. "azure site create jedwood"
- env variable from the CLI lowercased my key name from SECRET to secret. Had to use web interface to correct
- 0.8.2, and must be configured correctly in package.json
- logs are streaming! `azure site log tail`
- port? \\.\pipe\bea0dffc-de5b-47f4-8575-4d17c2175fd5

### Engine Yard
- pick between nginx as front or straight to Node.js, which gives you option of WebSockets
- you configure more of the setup and environment
- respectes package.json, only up to 0.8.11
- when my first deploy failed, a chat window popped up with option for me to put in my phone number
- can't seem to find env vars, but with SSH can drop a config file on the server

### dotCloud
- got burned early on, but coming back with an open mind
- CLI in Python
- MongoDB on board
- requires CC (recently dumped their free tier)
- PORT needs to be 8080
- `dotcloud env set` or via dotcloud.yml

### OpenShift
- free preview no CC
- deploy via git
- MongoDB on board as a "cartridge"

### CleverCloud (aka nodejs-cloud)
- Seems very early days. Sign-up and instructions not as friendly and clear
- Port set to 8080
- 0.10.3 and have Express and Socket.io pre-installed, but...
- don't even support environment variables. If you deploy with GIT, that's a must
- drops per 10 minutes(?)
- email upon failure instead of error message

