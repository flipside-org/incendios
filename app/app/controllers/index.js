
/*
 * GET home page.
 */

/**
 * Module dependencies.
 */
var mongoose = require('mongoose')
  , i18n = require('i18n')

var Page = mongoose.model('Page')

exports.view = function(req, res){
  if (!req.params.lang) {
    // fallback to site's default language
    return res.redirect(i18n.getLocale())
  }

  Page.load('', function (err, page) {
    if (err) {
      return next(err);
    }
    if (!page) {
      return next(new Error('Failed to load page: ' + permalink));
    }

    res.render('index', {
      title: page.title,
      content: page.content,
      menus: req.menus,
      page_meta : {
        type: 'index',
        url : req.url,
        full_url : get_current_url(req),
        lang : i18n.getLocale(),
        _translations : Page.get_translations(req, page),
      },
    });
  });
};
