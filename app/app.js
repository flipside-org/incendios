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
  , engine = require('ejs-locals');

// mongoose setup
require( './db' );


/**
 * Config and settings.
 */
var app = express();

// use ejs-locals for all ejs templates:
app.engine('ejs', engine);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
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
 * Models.
 */
var user = require('./routes/user')
  , geoadminarea = require('./routes/geoadminarea');


/**
 * Routes.
 */
var routes = require('./routes');

app.get('/', routes.index);
app.get('/users', user.list);
app.get( '/geo/:aaid', geoadminarea.index );
app.get( '/geo/:aaid/json/children', geoadminarea.get_children );
app.get( '/geo/:aaid/json', geoadminarea.get );


/**
 * App start.
 */
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
