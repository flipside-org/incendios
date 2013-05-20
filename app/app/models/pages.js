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
 * Page Schema
 */
var Page = new Schema({
  permalink : String,
  title : String,
  content : String
});

// maintain indexes
Page.index({permalink: 1});


/**
 * Methods
 */


/**
 * Statics
 */
Page.statics = {
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
mongoose.model('Page', Page);
