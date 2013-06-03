/**
 * @file
 * Model for Menu objects.
 *
 * @author Nuno Veloso (nunoveloso18@gmail.com)
 */


/**
 * Module dependencies.
 */
var mongoose = require('mongoose')
  , Schema   = mongoose.Schema;


/**
 * Page Schema
 */
var Menu = new Schema({
  url : String,
  title : String,
  language : String,
  menu : String,
  weight : Number
});

// Maintain indexes.
Menu.index({language: 1, menu: 1, weight: 1});


/**
 * Statics
 */
Menu.statics = {
  /**
   * Find page by permalink.
   *
   * @param [int] permalink
   * @param [function] cb
   * @api public
   */
  load: function (url, language, cb) {
    this.findOne({ url : url, language : language }).exec(cb);
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


// Expose Model.
mongoose.model('Menu', Menu);
