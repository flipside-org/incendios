/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Pages = mongoose.model('Pages');

/*
 * GET page.
 */

exports.page = function(req, res, next, permalik){
  Pages.load(permalik, function (err, pg) {
    if (err){
      return next(err);
    }
    if (!pg && permalik != ''){
      return next(new Error('Failed to load page: ' + permalik));
    }
    req.pg = pg;
    next();
  })
}

exports.view = function(req, res){
  console.log(req);
  var permalink = req.params.permalink;
  
  Pages.load(permalink, function(error, page){
    res.render('page', { title: page.title, content: page.content });
  });
};
