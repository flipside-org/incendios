/**
 * @file
 * Model for Page objects.
 *
 * @author Daniel Silva (daniel@flipside.org)
 */

/**
 * Module dependencies.
 */
var mongoose = require('mongoose')
  , Schema   = mongoose.Schema;

/**
 * Page Schema
 */
var Page = new Schema({
  permalink : String,
  title : String,
  content : String,
  language : String
});

// Maintain indexes.
Page.index({permalink: 1, language: 1});

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

// Expose Model.
mongoose.model('Page', Page);
