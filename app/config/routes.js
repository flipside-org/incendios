/**
 * @file
 * Routes configuration. All the routes should be listed here.
 *
 * @author Nuno Veloso (nunoveloso18@gmail.com)
 */


module.exports = function (app) {
  var i18n = require('../app/controllers/i18n');
  var menus = require('../app/controllers/menus');

  /**
   * GeoAdminAreas
   */
  var geoadminareas = require('../app/controllers/geoadminareas');
  app.get( '/:lang/por/:aa_1/:aa_2?/:aa_3?', geoadminareas.view );
  app.get( '/api/v1/geo/:aaid/json/children', geoadminareas.json_children );
  app.get( '/api/v1/geo/:aaid/json', geoadminareas.json );
  
  // Options render.
  app.get('/listlocationoptions/:parent_id', geoadminareas.list_location_render);
  app.param('parent_id', geoadminareas.list_location);

  app.param('lang', i18n.overrideLocaleFromPrefix, menus.main)

  app.param(':aaid', geoadminareas.geoadminarea, menus.main)
  app.param(':aa_1', i18n.transliterateParam, geoadminareas.geoadminarea, geoadminareas.redirect, menus.main)
  app.param(':aa_2', i18n.transliterateParam, geoadminareas.geoadminarea, geoadminareas.redirect, menus.main)
  app.param(':aa_3', i18n.transliterateParam, geoadminareas.geoadminarea, geoadminareas.redirect, menus.main)


  /**
   * StatsAdminAreas
   */
  var statsadminareas = require('../app/controllers/statsadminareas');
  app.get( '/api/v1/stats/:aaid/json', statsadminareas.json );

  app.param('aaid', statsadminareas.statsadminarea, menus.main)
  
  /**
   * YearStatus json.
   * Needs to be before stories.
   */
  var yearstatuses = require('../app/controllers/yearstatuses');
  app.get('/yearstatuses/json', yearstatuses.json);

  /**
   * Stories
   */

  var stories = require('../app/controllers/stories');
  app.get('/:lang/story/:permalink_story', stories.view);
  app.get('/:lang/stories', stories.list);
  
  app.param('permalink_story', stories.story, menus.main);


  /**
   * Pages
   */

  var pages = require('../app/controllers/pages');
  app.get('/:lang/:permalink', pages.view);

  app.param('permalink', pages.page, menus.main);


  /**
   * API - i18n for client-side
   */
  app.post('/t', function(req, res){
    res.send({translated: t(req.body.raw)});
  });


  /**
   * home / front page route
   */
  var index = require('../app/controllers/index');
  app.get('/:lang?', index.view);
  
  /**
   * Detailed occurrences.
   */
  var occurrenceDetail = require('../app/controllers/occurrencedetails');
  app.post('/occurrencedetails', occurrenceDetail.table);
  app.post('/occurrencedetails/marker', occurrenceDetail.marker);
}
