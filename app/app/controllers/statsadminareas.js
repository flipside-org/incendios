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
    if (err) return next(err)
    if (!statsadminarea && aaid != 0) return next(new Error('Failed to load administrative area with the code: ' + aaid))
    req.statsadminarea = statsadminarea

    next()
  })
}


/**
 * API: sends JSON of a given GeoAdminArea.
 */
exports.json = function(req, res){

  res.send(req.statsadminarea)
}

