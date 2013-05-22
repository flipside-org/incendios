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
var StatsAdminArea = mongoose.model('StatsAdminArea');


/**
 * Find GeoAdminArea by id
 */
exports.geoadminarea = function(req, res, next, aaid){

  GeoAdminArea.load(aaid, function (err, geoadminarea) {
    if (err) return next(err)
    if (!geoadminarea && aaid != 0) return next(new Error('Failed to load administrative area with the code: ' + aaid))
    req.geoadminarea = geoadminarea
    next()
  })
}


/**
 * Renders the page for a GeoAdminArea.
 */
exports.view = function(req, res){
  // variables
  var breadcrumbs = []

  // recursively generates the breadcumb trail
  breadcumb_trail(req.params.aaid);


  /**
   * Recursively generate the breadcrumb trail, render when done.
   * @param aaid [int] if the current pointer
   */
  function breadcumb_trail(aaid) {
    // load current AA trail pointer
    GeoAdminArea.load(aaid, function (err, aa_trail) {
      // error handling
      if (err) return res.render('500')

      // query criteria
      var options = {
        criteria: { parent_id: aa_trail.parent_id },
        fields: { aaid: 1, name: 1 }
      }

      // get the list of requested elements
      GeoAdminArea.list(options, function(err, sibling_aa) {
        // error handling
        if (err) return res.render('500')

        // execute!
        GeoAdminArea.count().exec(function (err, count) {

          breadcrumbs.unshift({
            select: aa_trail,
            list : sibling_aa,
          });

          // ok, trail is completed, now we will provide children selection and render
          if (aa_trail.parent_id == 0) {
            // query criteria
            var options = {
              criteria: { parent_id: req.params.aaid },
              fields: { aaid: 1, name: 1 }
            }

            // get the list of requested elements
            GeoAdminArea.list(options, function(err, children_aa) {
              // error handling
              if (err) return res.render('500')

              // execute!
              GeoAdminArea.count().exec(function (err, count) {
                breadcrumbs.push({
                  select: { type: 'new' },
                  list: children_aa,
                })

                // also load stats data
                StatsAdminArea.load(req.params.aaid, function (err, statsadminarea) {
                  if (err) statsadminarea = {}

                  // render!
                  res.render('index', { title: req.geoadminarea.name, breadcrumbs: breadcrumbs, statsadminarea: statsadminarea })
                  // send JSON
                  // res.send(breadcrumbs)
                })
              })
            })

          }
          else {
            breadcumb_trail(aa_trail.parent_id)
          }

        })
      })
    })
  }
};


/**
 * API: sends JSON of a given GeoAdminArea.
 */
exports.json = function(req, res){
  res.send(req.geoadminarea)
}


/**
 * API: sends JSON of all the children of a given GeoAdminArea
 */
exports.json_children = function(req, res){
  // query criteria
  var options = {
    criteria: { parent_id: req.params.aaid },
    fields: { aaid: 1, name: 1 }
  }

  // get the list of requested elements
  GeoAdminArea.list(options, function(err, geoadminareas) {
    // error handling
    if (err) return res.render('500')

    // execute!
    GeoAdminArea.count().exec(function (err, count) {
      // send JSON
      res.send(geoadminareas)
    })
  })
};



