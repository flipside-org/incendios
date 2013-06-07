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


var GeoAdminArea = mongoose.model('GeoAdminArea');
var GeoAdminDivision = mongoose.model('GeoAdminDivision');
var StatsAdminArea = mongoose.model('StatsAdminArea');
var Menu = mongoose.model('Menu');

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
    // menus!
    menus: function(state){
      // query criteria
      var options = {
        criteria: { menu: 'main', language: i18n.getLocale() },
      }
      // get the list of requested elements
      Menu.list(options, function(err, ms) {
        var menus = {};
        // loop to accomodate the data
        for (var m in ms) {
          if (!(ms[m].menu in menus)) {
            menus[ms[m].menu] = [];
          }
          menus[ms[m].menu].push(ms[m]);
        };
        // execute!
        state(err, menus);
      })
    }
  },
  function(err, r) {
    // error handling
    if (err) return res.render('500')
    // do
    req.geoadmindivisions = r.admin_divisions;
    req.menus = r.menus;
  });


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
                      full_url : req.headers.host + req.url,
                      lang : i18n.getLocale()
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



