/**
 * @file
 * Controller methods for Page objects.
 *
 * @author Daniel Silva (daniel@flipside.org)
 */


/**
 * Module dependencies.
 */
var mongoose = require('mongoose')
  , i18n = require('i18n')

var Menu = mongoose.model('Menu');


/**
 * Load main menu.
 */
exports.main = function(req, res, next){
  // query criteria
  var options = {
    criteria: { menu: 'main', language: i18n.getLocale() },
  }

  // get the list of requested elements
  Menu.list(options, function(err, ms) {
    var menus = {};
    // loop to accomodate the data
    for (var m in ms) {
      if (!(ms[m].menu in menus)) {
        menus[ms[m].menu] = [];
      }
      menus[ms[m].menu].push(ms[m]);
    };

    req.menus = menus;

    next()
  })
}

