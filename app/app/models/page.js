/**
 * @file
 * Model for Page objects.
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
var Page = new Schema({
  permalink : String,
  title : String,
  content : String,
  language : String,
  _translations : [{
    lang : String,
    _ref : { type: Schema.Types.ObjectId, ref: 'Page' }
  }]
});

// Maintain indexes.
Page.index({permalink: 1, language: 1});


/**
 * Statics
 */
Page.statics = {
  /**
   * Find page by permalink.
   *
   * @param [int] permalink
   * @param [function] cb
   * @api public
   */
  load : function (permalink, cb) {
    this.findOne({ permalink : permalink, language: i18n.getLocale() })
      .populate('_translations._ref')
      .exec(cb);
  },


  /**
   * Return list of translation available for this page
   *
   * @param req [object]
   * @param page loaded [object]
   * @return translations [array]: [{lang: l, url: u}]
   * @api public
   */
  get_translations : function (req, page) {
    // languages translation of that page
    var translations = []
      , page_translations = {}

    // prepare translation list from page
    page._translations.forEach(function(translation) {
      page_translations[translation.lang] = translation._ref.language + '/' + translation._ref.permalink
    })

    // for all the locales from the app, add
    i18n.getLocales().forEach(function(language) {
      if (language in page_translations) {
        translations.push({lang : language, url: page_translations[language]})
      }
      else if (language == i18n.getLocale()) {
        translations.push({lang : language, url: req.url.replace(/^\//, '')})
      }
      else {
        translations.push({lang : language, url: language})
      }
    })

    return translations
  }

}

// Expose Model.
mongoose.model('Page', Page);
