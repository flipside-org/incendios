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
    parent_id : Number
});

GeoAdminArea.index({aaid: 1});


/**
 * Methods
 */


/**
 * Statics
 */


/**
 * expose model
 */
mongoose.model('GeoAdminArea', GeoAdminArea);

