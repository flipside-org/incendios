/**
 * @file
 * Controller methods for StatsAdminArea objects.
 *
 * @author Nuno Veloso (nunoveloso18@gmail.com)
 */


/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var StatsAdminArea = mongoose.model('StatsAdminArea');
var GeoAdminArea = mongoose.model('GeoAdminArea');

/**
 * Find GeoAdminArea by id
 */
exports.statsadminarea = function(req, res, next, aaid){

  // load the object in the request
  StatsAdminArea.load(aaid, function (err, statsadminarea) {
    if (err) {
      return next(err);
    }
    
    // There are admin areas without occurrences. Ex: aaid: 110615
    // Return empty object.
    if (!statsadminarea && aaid != 0){
      req.statsadminarea = null;
    }
    else {
      req.statsadminarea = statsadminarea;
    }
    next();
  })
}


/**
 * API: sends JSON of a given GeoAdminArea.
 */
exports.json = function(req, res){
  res.send(req.statsadminarea);
}

