
/*
 * GET users listing.
 */

var mongoose = require('mongoose');
var GeoAdminArea = mongoose.model('GeoAdminArea');
var utils    = require('connect').utils;


exports.get_child_aaids = function(req, res){
  // res.send("respond with a resource");
  GeoAdminArea.
    find({ parent_id : req.params.id }, {'aaid': 1, 'name': 1}).
    exec( function ( err, geoadminareas ){
      if( err ) return next( err );
        console.log(geoadminareas);
      res.send(geoadminareas);
    });
};
