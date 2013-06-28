/**
 * Module dependencies.
 */
var mongoose = require('mongoose')
  , Schema   = mongoose.Schema;


/**
 * Getters
 */


/**
 * Setters
 */


/**
 * StatsAdminArea Schema
 */
var YearStatus = new Schema({
  year : Number,
  total : Number,
  aa_total : Number,
  falso_alarme : Number
});

// maintain indexes
YearStatus.index({year: 1});


/**
 * Methods
 */


/**
 * Statics
 */
YearStatus.statics = {
  /**
   * List the status for all years
   *
   * @param [function] cb
   * @api public
   */
  list: function (options, cb) {
    var criteria = options.criteria || {}
    var fields = options.fields || null
    this.find(criteria, fields).sort({year : 1})
      .exec(cb)
  }
}

/**
 * expose model
 */
mongoose.model('YearStatus', YearStatus);

