/**
 * @file
 * Controller methods for GeoAdminArea objects.
 *
 * @author Nuno Veloso (nunoveloso18@gmail.com)
 */


/**
 * Module dependencies.
 */
var mongoose = require('mongoose')
  , async = require('async')
  , i18n = require('i18n')
  , moment = require('moment')
  , fs = require('fs')

var path_offset = 3;

var GeoAdminArea = mongoose.model('GeoAdminArea');
var GeoAdminDivision = mongoose.model('GeoAdminDivision');
var StatsAdminArea = mongoose.model('StatsAdminArea');
var Menu = mongoose.model('Menu');


/**
 * Find GeoAdminArea by id
 */
exports.geoadminarea = function(req, res, next, aa){
  var criteria = {aa : aa};

  if (typeof criteria != "object") {
    next()
  }

  // this is to avoid homonym admin area to be pulled
  if (req.parent_id != null) {
    criteria.parent_id = req.parent_id;
  }

  GeoAdminArea.load(criteria, function (err, geoadminarea) {
    if (err) return next(err)
    if (!geoadminarea && aa != 0) return next(new Error('Failed to load administrative area with the code: ' + aa))

    req.geoadminarea = geoadminarea
    req.parent_id = geoadminarea.aaid;
    req.params.aaid = geoadminarea.aaid;

    next()
  })
}


/**
 * Renders the page for a GeoAdminArea.
 */
exports.view = function(req, res){
  // variables
  var breadcrumbs = []

  async.series({
    // get all the GeoAdminDivisions
    admin_divisions: function(state){
      // get the list of requested elements
      GeoAdminDivision.list({}, function(err, gads) {
        var geoadmindivisions = {};
        // loop to accomodate the data
        for (var gad in gads) {
          geoadmindivisions[gads[gad].type] = gads[gad].name;
        };
        // execute!
        state(err, geoadmindivisions);
      })
    },
  },
  function(err, r) {
    // error handling
    if (err) return res.render('500')
    // do
    req.geoadmindivisions = r.admin_divisions;
  });
  // res.json(req.params.aaid)
  // recursively generates the breadcumb trail
  breadcumb_trail(req.params.aaid);

  /**
   * Recursively generate the breadcrumb trail, render when done.
   * @param aaid [int] if the current pointer
   */
  function breadcumb_trail(aaid) {
    // load current AA trail pointer
    GeoAdminArea.load({ aa : aaid }, function (err, aa_trail) {
      // error handling
      if (err) return res.render('500')

      // query criteria
      var options = {
        criteria: { parent_id: aa_trail.parent_id },
        fields: { aaid: 1, name: 1, breadcrumb : 1 }
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
              fields: { aaid: 1, name: 1, breadcrumb : 1 }
            }

            // get the list of requested elements
            GeoAdminArea.list(options, function(err, children_aa) {
              // error handling
              if (err) return res.render('500')

              // execute!
              GeoAdminArea.count().exec(function (err, count) {
                breadcrumbs.push({
                  select: {
                    type: req.geoadminarea.type + 1
                  },
                  list: children_aa,
                })

                // also load stats data
                StatsAdminArea.load(req.params.aaid, function (err, statsadminarea) {
                  if (err) { statsadminarea = null; }

                  // do
                  var info = {
                    aaid : req.geoadminarea.aaid,
                    aa_name : req.geoadminarea.name,
                    geoadmindivision_name_raw : req.geoadmindivisions[req.geoadminarea.type],
                  }

                  if (statsadminarea != null && statsadminarea.top.incendio.date != 0) {
                    // Render the statistics verbose.

                    moment.lang(i18n.getLocale());

                    var stats = {
                      occurrences : statsadminarea.total,
                      top : {
                        year : {
                          year : statsadminarea.top.year,
                        },
                        fire : {
                          date : moment(statsadminarea.top.incendio.date, "YYYY-MM-DD").format('LL'),
                          ha : statsadminarea.top.incendio.aa_total
                        }
                      }
                    };

                    // Get area for top incêndio.
                    // Loop through data array to get correct year.
                    for (var i = 0; i < statsadminarea.data.length; i++) {
                      var data_year = statsadminarea.data[i];
                      if (data_year.year == statsadminarea.top.year) {
                        stats['top_year_ha'] = Math.round(data_year.aa_total);
                        stats.top.year.ha = Math.round(data_year.aa_total);
                        break;
                      }
                    }

                  }

                  // render!
                  res.render('geoadminarea', {
                    title: info.aa_name,
                    info: info,
                    breadcrumbs: breadcrumbs,
                    show_charts: statsadminarea == null ? false : true,
                    stats: stats,
                    menus: req.menus,
                    page_meta : {
                      type: 'geoadminarea',
                      url : req.url,
                      full_url : get_current_url(req),
                      lang : i18n.getLocale(),
                      _translations : GeoAdminArea.get_translations(req),
                    },
                    admin_divisions: req.geoadmindivisions
                  });
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

  /**
   * Replaces args in the string. This does not take into account
   * word boundaries so make sure that a arg does not contain another.
   * :example -- :example_word
   *
   * @param string string
   * @param object args
   *
   * @return string
   */
  function string_format(string, args) {
    for (var arg in args) {
      var regExp = new RegExp(arg, 'g');
      string = string.replace(regExp, args[arg]);
    }
    return string;
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


/**
 * Redirects to the full path admin area if needed.
 */
exports.redirect = function(req, res, next) {

  if (req.geoadminarea.type > (req.url.split('/').length - path_offset)) {
    res.redirect(301, '/' + i18n.getLocale() + '/por/' + req.geoadminarea.breadcrumb);
  }

  next()
}

/**
 * Renders <options> for all the administrative area of a given parent.
 * @param {Object} req
 * @param {Object} res
 * @param {Object} parent_id
 */
exports.list_location = function(req, res, next, parent_id) {
    var options = {
      criteria: {
        'parent_id' : parent_id
      },
      fields : {
        _id : 0,
        aaid: 1,
        name: 1,
      }
    };

    GeoAdminArea.list(options, function(err, geoadminareas_options){

      if (err) return next(new Error('Failed to load list of administrative areas with parent : ' + parent_id))

      req.list_location = geoadminareas_options;
      next();

    });
};

exports.list_location_render = function(req, res) {
      var data = { options : req.list_location }
      res.render('template/list_localtion_option', data, function(err, html){
        res.send(html);
      });
};


exports.serve_file = function (req, res) {
  var file = __dirname.replace('/app/controllers', '') + '/files/' + req.geoadminarea.aaid + '_' +
    req.geoadminarea.transliterated_name + '_' + i18n.getLocale() + '.png';

  fs.exists(file, function (exists) {
    if (exists) {
      console.log('File "' + file + '" exists. Serving.')
      res.download(file)
    }
    else {
      console.log('File "' + file + '" does not exist. Creating.')
    }
  })
}
