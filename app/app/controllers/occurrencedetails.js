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
          
          // Format date YYYY-MM-DD.
          // Ensure leading zeros.
          // Pieces will be glued toghether later.
          var date_alert = prop.data.data_alerta;
          var date_pieces = [
            date_alert.getFullYear(),
            ('0' + (date_alert.getMonth() + 1)).slice(-2),
            ('0' + date_alert.getDate()).slice(-2)
          ]
          
          data.rows.push({
            aa_total : prop.area_ardida.aa_total,
            date :  date_pieces.join('-'),
            place : '<a href="/' + i18n.getLocale() + '/por/' + prop.aaid.aaid_freguesia + '" title="' + prop.localizacao.freguesia + '">' + prop.localizacao.freguesia + '</a> (' + prop.localizacao.distrito + ', ' + prop.localizacao.concelho + ')',
            cause : prop.causa.tipocausa == "NULL" ? '--*' : t(prop.causa.tipocausa)
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
          if (response[index].properties.causa.tipocausa == "NULL") {
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