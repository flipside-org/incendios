
/*
 * GET users listing.
 */

var mongoose = require('mongoose');
var GeoAdminArea = mongoose.model('GeoAdminArea');
var utils = require('connect').utils;


exports.get_children = function(req, res){
  GeoAdminArea.
    find({ parent_id : req.params.aaid }, {'aaid': 1, 'name': 1, 'parent_id': 1}).
    exec( function ( err, geoadminareas ){
      if( err ) return next( err );
      res.send(geoadminareas);
    });
};

exports.get = function(req, res){
  GeoAdminArea.
    findOne({ aaid : req.params.aaid }).
    exec( function ( err, geoadminareas ){
      if( err ) return next( err );
      res.send(geoadminareas);
    });
};

exports.index = function(req, res){
  GeoAdminArea.
    findOne({ aaid : req.params.aaid }, {'aaid': 1, 'name': 1}).
    exec( function ( err, geoadminarea ){
      if( err ) return next( err );
      if (geoadminarea) {
        console.log(geoadminarea);
        res.render('index', { title: geoadminarea.name });
      }
      else {
        res.render('index', { title: 'FAIL!' });
      }
    });
};





