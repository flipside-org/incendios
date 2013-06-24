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
          header : ['Àrea ardida', 'Data', 'Localização', 'Causa'],
          rows : [],
          empty : 'There is no data...'
        };      
        
        for (index in response) {
          var prop = response[index].properties;
          
          data.rows.push({
            aa_total : prop.aa_total,
            date : prop.data_alerta,
            place : prop.freguesia + ' (' + prop.distrito + ', ' + prop.concelho + ')',
            cause : prop.tipocausa
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