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
 * Get all the app locales.
 * @return [array] with locale identifiers
 */
i18n.getLocales = function () {
  return conf.i18n.locales
}


/**
 * Config and settings.
 */
var app = express();
conf.global = config('global')
if ('dir_locations' in conf.global) {
  for (var c in conf.global.dir_locations) {
    var dir = conf.global.dir_locations[c]
    conf.global.dir_locations[c] = __dirname + dir
  }
}


// use ejs-locals for all ejs templates:
app.engine('ejs', engine);

app.configure(function(){
  app.set('port', conf.global.port || process.env.PORT || 3000);
  app.set('views', conf.global.dir_locations.views);
  app.set('view engine', conf.global.view_engine);

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

   // Handle 404
  // TODO: Move!
  app.use(function(req, res) {
     res.status(404).render('error/404.ejs', {
       title: 404,
       menus: req.menus,
       page_meta : {
         type: 'error',
         url : req.url,
         full_url : req.headers.host + req.url,
         lang : i18n.getLocale()
       }
      });
  });

  // Handle 500.
  // TODO: Move!
  app.use(function(error, req, res, next) {

    // TODO: Add translations.
    var fun_fact = [
      "No cats were armed during the creation of this page.",
      "During the eleven years of fires burnt an area equal to more than 1.5 times the biggest portuguese district.",
      "2003 was the worst year. 28% of all burnt area was due to occurrences that happened that year.",
      "The biggest fire recorded was caused by a lightning and it took almost 8 days to extinguish."
    ];

    var fact_no = Math.floor(Math.random() * (fun_fact.length - 1));

    res.status(500).render('error/500.ejs', {
      title: 500,
      menus: req.menus,
      content: fun_fact[fact_no],
      page_meta : {
        type: 'error',
        url : req.url,
        full_url : req.headers.host + req.url,
        lang : i18n.getLocale()
      }
     });
  });

});

app.configure('development', function(){
  app.use(express.errorHandler());
});


/**
 * Bootstrap all models.
 * Models are defined in the folder `./app/models`.
 * e.g. `./app/models/users.js`
 */
var models_path = conf.global.dir_locations.models
fs.readdirSync(models_path).forEach(function (file) {
  require(models_path + '/' + file);
})


/**
 * Routes.
 */
require('./config/routes')(app);


/**
 * Returns the current, full URL.
 * @param req [Object]
 * @return [String] of the URL
 */
get_current_url = function(req) {
  var current_url = 'http://'

  if ('x-forwarded-host' in req.headers) {
    current_url = current_url + req.headers['x-forwarded-host']
  }
  else if ('x-forwarded-server' in req.headers) {
    current_url = current_url + req.headers['x-forwarded-server']
  }
  else {
    current_url = current_url + req.headers.host
  }

  return current_url + req.url
}


/**
 * App start.
 */
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
