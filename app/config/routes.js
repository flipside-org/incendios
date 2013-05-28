/**
 * @file
 * Routes configuration. All the routes should be listed here.
 *
 * @author Nuno Veloso (nunoveloso18@gmail.com)
 */

module.exports = function (app) {

  /**
   * GeoAdminAreas
   */
  var geoadminareas = require('../app/controllers/geoadminareas');
  app.get( '/geo/:aaid', geoadminareas.view );
  app.get( '/geo/:aaid/json/children', geoadminareas.json_children );
  app.get( '/geo/:aaid/json', geoadminareas.json );

  app.param('aaid', geoadminareas.geoadminarea)


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
  app.get('/page/:permalink', pages.view);

  app.param('permalink', pages.page);


  /**
   * Stories
   */
  
  var stories = require('../app/controllers/stories');
  app.get('/story/:permalink_story', stories.view);
  app.param('permalink_story', stories.story);


  /**
   * home / front page route
   */
  var index = require('../app/controllers/index');
  app.get('/', index.view);
}
