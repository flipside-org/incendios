/**
 * @file
 * Controller methods for Page objects.
 *
 * @author Daniel Silva (daniel@flipside.org)
 * @author Nuno Veloso (nunoveloso18@gmail.com)
 */


/**
 * Module dependencies.
 */
var mongoose = require('mongoose')
  , i18n = require('i18n')

var Page = mongoose.model('Page')


/**
 * Load page by permalink.
 */
exports.page = function(req, res, next, permalink) {
  Page.load(permalink, function (err, page) {
    if (err){
      return next(err)
    }
    if (!page && permalink != '') {
      return next(new Error('Failed to load page: ' + permalink))
    }
    req.page = page
    next()
  })
}


/**
 * Renders the page for a Page.
 */
exports.view = function(req, res) {
  var page = req.page

  res.render('page', {
    title: page.title,
    content: page.content,
    menus: req.menus,
    page_meta : {
      type: 'page',
      url : req.url,
      full_url : get_current_url(req),
      lang : i18n.getLocale(),
      _translations : Page.get_translations(req, page),
    },
  })
}


