/**
 * @file
 * Model for Story objects.
 *
 * @author Daniel Silva (daniel@flipside.org)
 */

/**
 * Module dependencies.
 */
var mongoose = require('mongoose')
  , Schema   = mongoose.Schema
  , i18n = require('i18n');

/**
 * Page Schema
 */
var Story = new Schema({
  permalink : String,
  title : String,
  content : String,
  settings : Object,
  _translations : [{
    lang : String,
    _ref : { type: Schema.Types.ObjectId, ref: 'Story' }
  }]
});

// Maintain indexes.
Story.index({permalink: 1});

/**
 * Statics
 */
Story.statics = {
  /**
   * Find page by permalink.
   *
   * @param [int] permalink
   * @param [function] cb
   * @api public
   */
  load: function (permalink, cb) {
    this.findOne({ permalink : permalink, language: i18n.getLocale() })
      .populate('_translations._ref')
      .exec(cb)
  },

  /**
   * Lists all stories.
   *
   * @param [object] options for the query
   * @param [function] cb
   * @api public
   */
  list: function (options, cb) {
    var criteria = options.criteria || {};
    criteria.language = i18n.getLocale();
    var fields = options.fields || null;

    this.find(criteria, fields).exec(cb);
  },


  /**
   * Return list of translation available for this page
   *
   * @param req [object]
   * @param story loaded [object]
   * @return translations [array]: [{lang: l, url: u}]
   * @api public
   */
  get_translations : function (req, story) {
    // languages translation of that page
    var translations = []
      , story_translations = {}

    // prepare translation list from page
    story._translations.forEach(function(translation) {
      console.log(translation._ref.language)
      story_translations[translation.lang] = translation.lang + '/' + t('story') + '/' + translation._ref.permalink
    })

    // for all the locales from the app, add
    i18n.getLocales().forEach(function(language) {
      if (language in story_translations) {
        translations.push({lang : language, url: story_translations[language]})
      }
      else if (language == i18n.getLocale()) {
        translations.push({lang : language, url: req.url.replace(/^\//, '')})
      }
      else {
        translations.push({lang : language, url: language})
      }
    })

console.log(story_translations)

    return translations
  }

}

// Expose Model.
mongoose.model('Story', Story);
