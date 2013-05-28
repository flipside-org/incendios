/**
 * @file
 * Controller methods for Story objects.
 *
 * @author Daniel Silva (daniel@flipside.org)
 */


/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Story = mongoose.model('Story');


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
  res.render('story', { title: story.title, content: story.content, scripts: story.scripts, type: 'story' });
};
