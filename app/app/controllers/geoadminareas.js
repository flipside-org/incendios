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
    if (!geoadminarea && aaid != 0) return next(new Error('Failed to load administrative area with the code: ' + aaid))
    req.geoadminarea = geoadminarea
  console.log(geoadminarea);
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
 * API: sends JSON of a given GeoAdminArea.
 */
exports.json = function(req, res){
  res.send(req.geoadminarea)
}


/**
 * API: sends JSON of all the chidren of a given GeoAdminArea
 */
exports.json_children = function(req, res){
  var options = {
    criteria: { parent_id: req.params.aaid },
    fields: { aaid: 1, name: 1}
  }

  GeoAdminArea.list(options, function(err, geoadminareas) {
    if (err) return res.render('500')
    GeoAdminArea.count().exec(function (err, count) {
      res.send(geoadminareas)
    })
  })
};



