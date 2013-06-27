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

