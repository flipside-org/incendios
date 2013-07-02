/**
 * @file
 * Model for occurrences.
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
var OccurrenceDetail = new Schema({
  type : String,
  properties : Object,
  geometry : Object
  
});

// Maintain indexes.
OccurrenceDetail.index({'properties.aa_total': -1});

/**
 * Statics
 */
OccurrenceDetail.statics = {
  /**
   * Gets the occurrences ordered by aa_total.
   *
   * @param [int] num
   *   Number of occurrences to return
   * @param [function] cb
   * @api public
   */
  top: function (num, cb) {
    var fields = {
      '_id' : 0,
      'type' : 1,
      'properties.x' : 1,
      'properties.y' : 1,
      'properties.distrito' : 1,
      'properties.concelho' : 1,
      'properties.freguesia' : 1,
      'properties.aaid_freguesia' : 1,
      'properties.data_alerta' : 1,
      'properties.aa_total' : 1,
      'properties.tipocausa' : 1,
      'geometry' : 1
    };
    this.find({ 'properties.aa_total' : { $gt : 10 }}, fields).sort({'properties.aa_total': -1}).limit(num).exec(cb);
  },
  
  exper: function (offset, num, cb) {
    var fields = {
      '_id' : 1,
      //'type' : 1,
      //'properties.x' : 1,
      //'properties.y' : 1,
      //'properties.distrito' : 1,
      //'properties.concelho' : 1,
      //'properties.freguesia' : 1,
      //'properties.aaid_freguesia' : 1,
      'properties.data_alerta' : 1,
      'properties.aa_total' : 1,
      //'properties.tipocausa' : 1,
      'geometry' : 1
    };
    this.find({'properties.data_alerta': {$ne : ''}, 'properties.aa_total': {$gt : 1}}, fields).sort({'properties.data_alerta': 1}).limit(num).skip(offset).exec(cb);
  }

}

// Expose Model.
mongoose.model('OccurrenceDetail', OccurrenceDetail);
