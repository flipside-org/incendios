/**
 * @file
 * Model declaration for GeoAdminDivision objects.
 *
 * A GeoAdminDivision is metadata related to GeoAdminArea type field.
 *
 * @author Nuno Veloso (nunoveloso18@gmail.com)
 */


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
 * GeoAdminArea Schema
 */
var GeoAdminDivision = new Schema({
  name : String,
  type : Number
});

// maintain indexes
GeoAdminDivision.index({type: 1});


/**
 * Methods
 */


/**
 * Statics
 */
GeoAdminDivision.statics = {
  /**
   * Find GeoAdminDivision by type.
   *
   * @param [int] aaid
   * @param [function] cb
   * @api public
   */
  load: function (type, cb) {
    this.findOne({ type : type })
      .exec(cb);
  },

  /**
   * List GeoAdminDivisions according to passed options.
   *
   * @param [object] options for the query
   * @param [function] cb
   * @api public
   */
  list: function (options, cb) {
    var criteria = options.criteria || {}
    var fields = options.fields || null

    this.find(criteria, fields)
      .exec(cb)
  },

}

/**
 * expose model
 */
mongoose.model('GeoAdminDivision', GeoAdminDivision);

