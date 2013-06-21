/**
 * @file
 * Controller methods for Story objects.
 *
 * @author Daniel Silva (daniel@flipside.org)
 */


/**
 * Module dependencies.
 */
var mongoose = require('mongoose')
  , i18n = require('i18n')
  , async = require('async');

var Story = mongoose.model('Story');
var Page = mongoose.model('Page');


/**
 * Load page by permalink.
 */
exports.story = function(req, res, next, permalink_story){
  Story.load(permalink_story, function (err, story) {
    if (err){
      return next(err);
    }
    if (!story && permalink_story != ''){
      return next(new Error('Failed to load story: ' + permalink_story));
    }
    req.story = story;
    next();
  })
}


/**
 * Renders the page for a Story.
 */
exports.view = function(req, res){
  var story = req.story;
  res.render('story', {
    title: story.title,
    content: story.content,
    scripts: story.scripts,
    menus: req.menus,
    page_meta : {
      type: 'story',
      url : req.url,
      full_url : req.headers.host + req.url,
      lang : i18n.getLocale()
    },
  });
};

/**
 * Renders the page for stories listing.
 */
exports.list = function(req, res){
  
  async.auto({
    // Get story listing.
    stories_list : function(state){
      var options = {
        fields : {
          permalink : 1,
          title : 1
        }
      };
      Story.list(options, function(err, list) {
        state(err, list);
      });
    },
    // Render stories.
    stories_render : ['stories_list', function(state, results){      
      var data = {
        stories: results.stories_list,
        lang : i18n.getLocale()
      };
      res.render('template/stories_list', data, function(err, html){
        state(err, html);
      });
    }],
    
    // Get page blocks
    stories_blocks_before : function(state) {
      Page.load('stories-block-before', function (err, page) {
        state(err, page.content);
      });
    },
    // Get page blocks
    stories_blocks_after : function(state) {
      Page.load('stories-block-after', function (err, page) {
        state(err, page.content);
      });
    }
  },
  function(err, result) {
    // error handling
    if (err) return res.render('500')
    
    res.render('page', { 
      title: 'Stories',
      content: result.stories_blocks_before + result.stories_render + result.stories_blocks_after,
      menus: req.menus,
      page_meta : {
        type: 'page',
        url : req.url,
        full_url : req.headers.host + req.url,
        lang : i18n.getLocale()
      },
    });
  });
  
};
