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
  , i18n = require('i18n');

// mongoose setup
// @todo use read config instead!
mongoose.connect('mongodb://localhost/incendios');


/**
 * Config and settings.
 */
var app = express();

// i18n
i18n.configure({
  // setup locales
  locales: ['en', 'pt'],

  defaultLocale: 'pt',

  // sets cookie to parse locale settings from
  cookie: 'incendios_locale',

  // where to the json files will be stored
  directory: __dirname + '/locales'
});

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
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
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
