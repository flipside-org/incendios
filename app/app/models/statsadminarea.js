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
var StatsAdminArea = new Schema({
    aaid : { type : Number, unique : true },
    aaid_data : { type : Schema.Types.ObjectId, ref : 'GeoAdminArea' },
    total : Number,
    aa_total : Number,
    top : {
      incendio : {
        aa_total: Number,
        date : String
      },
      year: Number
    },
    data : [ Schema.Types.Mixed ]
});

// maintain indexes
StatsAdminArea.index({aaid: 1});


/**
 * Methods
 */


/**
 * Statics
 */
StatsAdminArea.statics = {
  /**
   * Find Stats by aaid.
   *
   * @param [int] aaid
   * @param [function] cb
   * @api public
   */
  load: function (aaid, cb) {
    this.findOne({ aaid : aaid })
      // .populate('aaid_data') // @todo leave it off for now, do when full review!
      .exec(cb);
  },

  /**
   * List Stats according to passed options.
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
mongoose.model('StatsAdminArea', StatsAdminArea);

