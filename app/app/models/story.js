/**
 * @file
 * Model for Story objects.
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
var Story = new Schema({
  permalink : String,
  title : String,
  content : String,
  scripts : String
});

// Maintain indexes.
Story.index({permalink: 1});

/**
 * Statics
 */
Story.statics = {
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
mongoose.model('Story', Story);
