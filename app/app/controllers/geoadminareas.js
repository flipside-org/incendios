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
var async = require('async');
var moment = require('moment');


var GeoAdminArea = mongoose.model('GeoAdminArea');
var GeoAdminDivision = mongoose.model('GeoAdminDivision');
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
                  if (err) {statsadminarea = null;}

                  // this is to execute synchronously function (example, as here it's not doing anything)
                  async.series({
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
                    two: function(state){
                      setTimeout(function(){
                        state(null, 2);
                      }, 100);
                    }
                  },
                  function(err, r) {
                    // error handling
                    if (err) return res.render('500')

                    // do
                    var admin_area = req.geoadminarea;

                    var stats = '';
                    if (statsadminarea != null && statsadminarea.top.incendio.date != 0) {
                      // Render the statistics verbose.
                      var sentence = 'Entre 2001 e 2011 registaram-se :occurrences ocorências :pp_admin_area de :admin_area. :top_year_year foi o ano mais grave tendo ardido :top_year_ha hectares. O maior incêndio que teve início :pd_admin_area ocorreu a :top_incendio_date consumindo :top_incendio_ha hectares.';

                      moment.lang('pt');
                      var args = {
                        ':occurrences' : statsadminarea.total,
                        ':admin_area' : admin_area.name,
                        // Pronome pessoal and admin area.
                        // 3 stands for freguesia
                        ':pp_admin_area' : ((admin_area.type == 3) ? 'na ' : 'no ') + r.admin_divisions[admin_area.type],
                        ':top_year_year' : statsadminarea.top.year,
                        // Pronome demonstrativo and admin area.
                        // 3 stands for freguesia
                        ':pd_admin_area' : ((admin_area.type == 3) ? 'nesta ' : 'neste ') + r.admin_divisions[admin_area.type],
                        ':top_incendio_date' : moment(statsadminarea.top.incendio.date, "YYYY-MM-DD").format('LL'),
                        ':top_incendio_ha' : statsadminarea.top.incendio.aa_total
                      };

                      // Get area for top incêndio.
                      // Loop through data array to get correct year.
                      for (var i = 0; i < statsadminarea.data.length; i++) {
                        var data_year = statsadminarea.data[i];
                        if (data_year.year == statsadminarea.top.year) {
                          args[':top_year_ha'] = Math.round(data_year.aa_total);
                          break;
                        }
                      }

                      stats = string_format(sentence, args);
                    }
                    else if (statsadminarea != null && statsadminarea.top.incendio.date == 0) {
                      // There wasn't an occurrence with burnt area over 1 ha.

                    }
                    else {
                      // Nothing ever happened.
                      stats = 'Encontrou o local mais seguro de Portugal. Nunca aconteceu nada aqui.';
                    }


                    // render!
                    res.render('geoadminarea', {
                      title: req.geoadminarea.name,
                      type_verbose : r.admin_divisions[req.geoadminarea.type],
                      breadcrumbs: breadcrumbs,
                      verbose_statistics: stats,
                      show_charts: statsadminarea == null ? false : true,
                      type: 'geoadminarea',
                    });
                    // send JSON
                    // res.send(breadcrumbs)

                  });

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



