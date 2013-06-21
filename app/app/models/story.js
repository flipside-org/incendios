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
  , Schema   = mongoose.Schema
  , i18n = require('i18n');

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
    this.findOne({ permalink : permalink, language: i18n.getLocale() }).exec(cb);
  },
  
  /**
   * Lists all stories.
   *
   * @param [object] options for the query
   * @param [function] cb
   * @api public
   */
  list: function (options, cb) {
    var criteria = options.criteria || {};
    criteria.language = i18n.getLocale();
    var fields = options.fields || null;
    
    this.find(criteria, fields).exec(cb);
  }

}

// Expose Model.
mongoose.model('Story', Story);
