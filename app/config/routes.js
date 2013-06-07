/**
 * @file
 * Routes configuration. All the routes should be listed here.
 *
 * @author Nuno Veloso (nunoveloso18@gmail.com)
 */


module.exports = function (app) {
  var i18n = require('../app/controllers/i18n');


  /**
   * GeoAdminAreas
   */
  var geoadminareas = require('../app/controllers/geoadminareas');
  app.get( '/geo/:aa_1/:aa_2?/:aa_3?', geoadminareas.view );
  app.get( '/api/v1/geo/:aaid/json/children', geoadminareas.json_children );
  app.get( '/api/v1/geo/:aaid/json', geoadminareas.json );

  app.param('lang', i18n.overrideLocaleFromPrefix)

  app.param(':aaid', geoadminareas.geoadminarea)
  app.param(':aa_1', geoadminareas.geoadminarea)
  app.param(':aa_2', geoadminareas.geoadminarea)
  app.param(':aa_3', geoadminareas.geoadminarea)


  /**
   * StatsAdminAreas
   */
  var statsadminareas = require('../app/controllers/statsadminareas');
  app.get( '/stats/:aaid/json', statsadminareas.json );

  app.param('aaid', statsadminareas.statsadminarea)


  /**
   * Pages
   */

  var pages = require('../app/controllers/pages');
  app.get('/:lang/page/:permalink', pages.view);

  app.param('permalink', pages.page);


  /**
   * Stories
   */

  var stories = require('../app/controllers/stories');
  app.get('/:lang/story/:permalink_story', stories.view);

  app.param('permalink_story', stories.story);


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
  app.get('/', index.view);
}
