
/*
 * GET home page.
 */

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var i18n = require('i18n');

var Page = mongoose.model('Page');

exports.view = function(req, res){
  if (!req.params.lang) {
    // English if no language.
    return res.redirect('en');
  }
  
  Page.load('', function (err, page) {
    if (err){
      return next(err);
    }
    if (!page){
      return next(new Error('Failed to load page: ' + permalink));
    }
    
    res.render('index', {
      title: page.title,
      content: page.content,
      menus: req.menus,
      page_meta : {
        type: 'index',
        url : req.url,
        full_url : req.headers.host + req.url,
        lang : i18n.getLocale()
      },
    });
  });
};
