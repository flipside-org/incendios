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
var GeoAdminArea = new Schema({
    aaid : {type :Number, unique: true},
    name    : String,
    type    : Number,
    parent_id : Number,
    geo : {
      area : Number,
      min : {
        x : Number,
        y : Number
      },
      max : {
        x : Number,
        y : Number
      },
      center : {
        x : Number,
        y : Number
      }
    }
});

// maintain indexes
GeoAdminArea.index({aaid: 1});


/**
 * Methods
 */


/**
 * Statics
 */
GeoAdminArea.statics = {
  /**
   * Find AdminArea by aaid.
   *
   * @param [int] aaid
   * @param [function] cb
   * @api public
   */
  load: function (aaid, cb) {
    this.findOne({ aaid : aaid })
      .exec(cb);
  },

  /**
   * List AdminArea according to passed options.
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
mongoose.model('GeoAdminArea', GeoAdminArea);

