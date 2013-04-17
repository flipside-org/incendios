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
  app.get( '/geo/:aaid', geoadminareas.index );
  app.get( '/geo/:aaid/json/children', geoadminareas.get_children );
  app.get( '/geo/:aaid/json', geoadminareas.get );

  /**
   * Users
   */
  var users = require('../app/controllers/users');
  app.get('/users', users.list);

  /**
   * home / front page route
   */
  app.get('/', geoadminareas.index);
}
