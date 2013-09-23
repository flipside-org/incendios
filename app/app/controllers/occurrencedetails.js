/**
 * @file
 * Controller methods for occurrences.
 *
 * @author Daniel Silva (daniel@flipside.org)
 */


/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    i18n = require('i18n'),
    moment = require('moment');

var OccurrenceDetail = mongoose.model('OccurrenceDetail');

/**
 * Renders a detailed table according to the id.
 */
exports.table = function(req, res){
  var id = req.body.id;

  switch (id) {
    case 'big-fires':

      OccurrenceDetail.top(10, function (err, response) {
        var data = {
          header : [t('Burnt area (ha)'), t('Date'), t('Location'), t('Cause')],
          rows : [],
          empty : t('There is no data...')
        };

        for (index in response) {
          var prop = response[index].properties;

          data.rows.push({
            aa_total : prop.area_ardida.aa_total,
            date :  moment(prop.data.data_alerta).format('YYYY-MM-DD'),
            place : '<a href="/' + i18n.getLocale() + '/por/' + prop.aaid.aaid_freguesia + '" title="' + prop.localizacao.freguesia + '">' + prop.localizacao.freguesia + '</a> (' + prop.localizacao.distrito + ', ' + prop.localizacao.concelho + ')',
            cause : prop.causa.tipocausa == null ? '--*' : t(prop.causa.tipocausa)
          });
        }

        res.render('template/table', data);
      });

    break;
    default:
      res.send('Invalid id: ' + id);
    break;
  }
};


exports.marker = function(req, res){
  var id = req.body.id;

  switch (id) {
    case 'big-fires':

      OccurrenceDetail.top(10, function (err, response) {
        // Handle nulls.
        for (index in response) {
          if (response[index].properties.causa.tipocausa == null) {
            response[index].properties.causa.tipocausa = '--*';
          }
        }
        var data = {
          type: "FeatureCollection",
          features: response
        };

        res.send(data);
      });

    break;
    default:
      res.send(null);
    break;
  }
}


/**
 * API: sends JSON of a given GeoAdminArea.
 */
exports.jt_json = function(req, res){

  // our hardcoded default vars
  var pager_size = 10
    , pager_start = 0

  // we will override these values from GET arguments
  var url_query = req._parsedUrl.query
  if (req._parsedUrl.query) {
    url_query.split('&').forEach(function(query_element) {
      query_element = query_element.split('=')
      switch (query_element[0]) {
        // pager size
        case 'jtPageSize':
          pager_size = parseInt(query_element[1])
          break;
        // pager start
        case 'jtStartIndex':
          pager_start = parseInt(query_element[1])
          break;
      }
    })
  }


  // depending on the type of admin area
  if (req.geoadminarea.type == 3) {
    var criteria = {"properties.aaid.aaid_freguesia": req.geoadminarea.aaid}
  }
  else if (req.geoadminarea.type == 2) {
    var criteria = {"properties.aaid.aaid_municipio": req.geoadminarea.aaid}
  }
  else if (req.geoadminarea.type == 1) {
    var criteria = {"properties.aaid.aaid_distrito": req.geoadminarea.aaid}
  }
  var options = {criteria: criteria}


  // @note (fron @nunoveloso)
  // For unknown reasons Mongoose `count()` is not working here.
  // So we are always pulling all the results and display only the requested ones.
  // Mongo and node seem to cope just fine with this, but I am note happy
  // @todo - revisit ASAP!
  OccurrenceDetail.jt_json(options, function(err, occurrences_details) {
    // response squeleton
    var response = {
      Result : "OK",
      TotalRecordCount : occurrences_details.length,
      Records : [],
    }

    // response an error
    if (err) {

    }
    // send the results back
    else{
      // prepare the results
      for (var od in occurrences_details) {
        // skip cases
        if (od < pager_start) {
          continue
        }
        // exit loop cases
        if (od == pager_start + pager_size) {
          break
        }

        var occurrence = occurrences_details[od].properties
        // add to records array
        response.Records.push({
          line : od,
          codigo : occurrence.meta.codigo,
          classificacao : t(occurrence.meta.classificacao),
          distrito : occurrence.localizacao.distrito,
          concelho : occurrence.localizacao.concelho,
          freguesia : occurrence.localizacao.freguesia,
          aa_total : occurrence.area_ardida.aa_total,
          data_alerta : occurrence.data.data_alerta,
        })
      }

      // deliver JSON response
      res.send(response)
    }
  })
}


