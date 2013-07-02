/**
 * @file
 * Controller methods for YearStatus objects.
 *
 * @author Daniel Silva (daniel.silva@flipside.org)
 */


/**
 * Module dependencies.
 */
var mongoose = require('mongoose')

var YearStatus = mongoose.model('YearStatus');

/**
 * API: sends JSON of the yearstatus.
 */
exports.json = function(req, res){
  YearStatus.list({}, function (err, yearstatus) {
    if (err) {
      return next(err);
    }
    res.send(yearstatus);
  });
}

/**
 * Renders a detailed table according to the id.
 */
exports.table = function(req, res){
  var id = req.body.id;
  
  switch (id) {
    case 'avg-occurrence-year':
      
      YearStatus.list({}, function (err, yearstatus) {
        
        var row = Array();
        for (index in yearstatus) {
          row.push(Math.round(yearstatus[index].aa_total / yearstatus[index].total * 10) / 10);
        }
        
        var data = {
          header : ["'01", "'02", "'03", "'04", "'05", "'06", "'07", "'08", "'09", "'10", "'11", ],
          rows : [row],
          empty : t('There is no data...')
        };
        
        res.render('template/table', data);
      });
    
    break;
    default:
      res.send('Invalid id: ' + id);
    break;
  }
};