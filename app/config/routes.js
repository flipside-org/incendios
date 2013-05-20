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
   * StatsAdminArea
   */
  var statsadminareas = require('../app/controllers/statsadminareas');
  app.get( '/stats/:aaid/json', statsadminareas.json );

  app.param('aaid', statsadminareas.statsadminarea)


  /**
   * About
   */
  var about = require('../app/controllers/about');
  app.get('/about', about.view);


  /**
   * Users
   */
  var users = require('../app/controllers/users');
  app.get('/users', users.list);


  /**
   * home / front page route
   */
  app.get('/', geoadminareas.json);
}
