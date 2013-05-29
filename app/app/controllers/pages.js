/**
 * @file
 * Controller methods for Page objects.
 *
 * @author Daniel Silva (daniel@flipside.org)
 */


/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Page = mongoose.model('Page');


/**
 * Load page by permalink.
 */
exports.page = function(req, res, next, permalink){
  Page.load(permalink, function (err, page) {
    if (err){
      return next(err);
    }
    if (!page && permalink != ''){
      return next(new Error('Failed to load page: ' + permalink));
    }
    req.page = page;
    next();
  })
}


/**
 * Renders the page for a Page.
 */
exports.view = function(req, res){
  var page = req.page;
  res.render('page', { title: page.title, content: page.content, type: 'page' });
};
