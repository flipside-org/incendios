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

var Page = mongoose.model('Page');
var Story = mongoose.model('Story');


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
  
  // Special code for stories page.
  switch (page.permalink) {
    case 'stories':
    
      var options = {
        fields : { permalink : 1, title : 1}
      };

      Story.list(options, function(err, list) {
        res.render('template/stories_list', { stories: list, lang : i18n.getLocale() }, function(err, html){
          page.content = page.content.replace('{{stories_list}}', html);
          
          res.render('page', {
            title: page.title,
            content: page.content,
            menus: req.menus,
            page_meta : {
              type: 'page',
              url : req.url,
              full_url : req.headers.host + req.url,
              lang : i18n.getLocale()
            },
          });

        });
        
      });
    break;
    default :
      res.render('page', {
        title: page.title,
        content: page.content,
        menus: req.menus,
        page_meta : {
          type: 'page',
          url : req.url,
          full_url : req.headers.host + req.url,
          lang : i18n.getLocale()
        },
      });
    break;
  }
};
