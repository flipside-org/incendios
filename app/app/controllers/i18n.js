/**
 * @file
 * Controller methods for i18n handling.
 *
 * @author Nuno Veloso (nunoveloso18@gmail.com)
 */

var i18n = require('i18n');


/**
 * Overrides the local according to path prefix.
 */
exports.overrideLocaleFromPrefix = function (req, res, next, lang) {
  if (lang === null) {
    return;
  }
  i18n.setLocale(lang.toLowerCase());
  next();
};
