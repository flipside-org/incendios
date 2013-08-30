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
OccurrenceDetail.index({'properties.area_ardida.aa_total': -1});

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
      'properties.localizacao.distrito' : 1,
      'properties.localizacao.concelho' : 1,
      'properties.localizacao.freguesia' : 1,
      'properties.aaid.aaid_freguesia' : 1,
      'properties.data.data_alerta' : 1,
      'properties.area_ardida.aa_total' : 1,
      'properties.causa.tipocausa' : 1,
      'geometry' : 1
    };
    this.find({ 'properties.area_ardida.aa_total' : { $gt : 10 }}, fields).sort({'properties.area_ardida.aa_total': -1}).limit(num).exec(cb);
  },

  /**
   * List OccurrenceDetails according to passed options.
   *
   * @param [object] options for the query
   * @param [function] cb
   * @api public
   */
  list: function (options, cb) {
    var criteria = options.criteria || {}
      , fields = options.fields || null
      , data

    this.find(criteria, fields).exec(cb)
  },


}

// Expose Model.
mongoose.model('OccurrenceDetail', OccurrenceDetail);
