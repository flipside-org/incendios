/**
 * @file
 * Controller methods for GeoAdminArea objects.
 *
 * @author Nuno Veloso (nunoveloso18@gmail.com)
 */


/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var GeoAdminArea = mongoose.model('GeoAdminArea');


/**
 * Find GeoAdminArea by id
 */
exports.geoadminarea = function(req, res, next, aaid){

  GeoAdminArea.load(aaid, function (err, geoadminarea) {
    if (err) return next(err)
    if (!geoadminarea) return next(new Error('Failed to load administrative area with the code: ' + aaid))
    req.geoadminarea = geoadminarea
    next()
  })
}


/**
 * Renders the page for a GeoAdminArea.
 */
exports.view = function(req, res){
  res.render('index', { title: req.geoadminarea.name });
};


/**
 * API: sends json of a given GeoAdminArea.
 */
exports.json = function(req, res){
  res.send(req.geoadminarea)
}


/**
 * @todo
 */
exports.get_children = function(req, res){
  GeoAdminArea.
    find({ parent_id : req.params.aaid }, {'aaid': 1, 'name': 1, 'parent_id': 1}).
    exec( function ( err, geoadminareas ){
      if( err ) return next( err );
      res.send(geoadminareas);
    });
};


