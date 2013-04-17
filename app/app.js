/**
 * @file
 * Main application entry file. Please note, the order of loading is important.
 * Configuration loading and booting of controllers and custom error handlers
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
  , mongoose = require('mongoose');

// mongoose setup
// @todo use read config instead!
mongoose.connect('mongodb://localhost/incendios');


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
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


/**
 * Bootstrap models.
 */
var models_path = __dirname + '/app/models';
require(models_path + '/' + 'geoadminareas.js');


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
