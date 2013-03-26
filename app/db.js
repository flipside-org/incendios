var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;

var GeoAdminArea = new Schema({
    aaid : {type :Number, unique: true},
    name    : String,
    type    : Number,
    parent_id : Number
});

GeoAdminArea.index({aaid: 1});

mongoose.model( 'GeoAdminArea', GeoAdminArea );

mongoose.connect( 'mongodb://localhost/incendios' );
