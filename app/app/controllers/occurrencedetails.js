/**
 * @file
 * Controller methods for occurrences.
 *
 * @author Daniel Silva (daniel@flipside.org)
 */


/**
 * Module dependencies.
 */
var mongoose = require('mongoose')
  , i18n = require('i18n')

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
            aa_total : prop.aa_total,
            date : prop.data_alerta,
            place : '<a href="/' + i18n.getLocale() + '/por/' + prop.aaid_freguesia + '" title="' + prop.freguesia + '">' + prop.freguesia + '</a> (' + prop.distrito + ', ' + prop.concelho + ')',
            cause : prop.tipocausa == "NULL" ? '--*' : t(prop.tipocausa)
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
          if (response[index].properties.tipocausa == "NULL") {
            response[index].properties.tipocausa = '--*';
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