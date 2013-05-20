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
var Pages = new Schema({
    permalink : String,
    title    : String,
    content : String
});


/**
 * Methods
 */


/**
 * Statics
 */
Pages.statics = {
  /**
   * Find page by permalink.
   *
   * @param [int] permalink
   * @param [function] cb
   * @api public
   */
  load: function (permalink, cb) {
    this.findOne({ permalink : permalink }).exec(cb);
  }

}

/**
 * expose model
 */
mongoose.model('Pages', Pages);
