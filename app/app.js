/**
 * @file
 * Main application entry file. Please note, the order of loading is important.
 * Configuration loading and booting of controllers and custom error handlers.
 *
 * @author Nuno Veloso (nunoveloso18@gmail.com)
 */


/**
 * Module dependencies.
 */
var express = require('express')
  , http = require('http')
  , path = require('path')
  , engine = require('ejs-locals')
  , mongoose = require('mongoose')
  , fs = require('fs')
  , i18n = require('i18n')
  , config = require('konphyg')(__dirname + "/config");

var conf = {}


/**
 * mongoose setup
 */
conf.mongo = config('mongodb')
if(!('uri' in conf.mongo)) {
  conf.mongo.uri = 'mongodb://'
  if ('user' in conf.mongo) conf.mongo.uri += conf.mongo.user
  if ('password' in conf.mongo) conf.mongo.uri += ':' + conf.mongo.password
  if ('user' in conf.mongo && 'host' in conf.mongo) conf.mongo.uri += '@' + conf.mongo.host
  if (!('user' in conf.mongo) && 'host' in conf.mongo) conf.mongo.uri += conf.mongo.host
  if ('port' in conf.mongo) conf.mongo.uri += ':' + conf.mongo.port
  if ('db' in conf.mongo) conf.mongo.uri += '/' + conf.mongo.db
  if (!('options' in conf.mongo)) conf.mongo.options = {}
}
mongoose.connect(conf.mongo.uri, conf.mongo.options);


/**
 * i18n config
 */
conf.i18n = config('i18n')
if ('directory' in conf.i18n) conf.i18n.directory = __dirname + conf.i18n.directory
i18n.configure(conf.i18n)

t = i18n.__;
tn = i18n.__n;





/**
 * Config and settings.
 */
var app = express();


// use ejs-locals for all ejs templates:
app.engine('ejs', engine);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/app/views');
  app.set('view engine', 'ejs');

  app.locals({
      't':  i18n.__
    , 'tn': i18n.__n
  });

  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(path.join(__dirname, 'public')));
  // this needs to come AFTER the static declaration because Middleware get executed in sequential order
  app.use(app.router);
  // you will need to use cookieParser to expose cookies to req.cookies
  app.use(express.cookieParser());
  // i18n init parses req for language headers, cookies, etc.
  app.use(i18n.init);

});

app.configure('development', function(){
  app.use(express.errorHandler());
});


/**
 * Bootstrap all models.
 * Models are defined in the folder `./app/models`.
 * e.g. `./app/models/users.js`
 */
var models_path = __dirname + '/app/models';
fs.readdirSync(models_path).forEach(function (file) {
  require(models_path + '/' + file);
})


/**
 * Routes.
 */
require('./config/routes')(app);


/**
 * App start.
 */
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
