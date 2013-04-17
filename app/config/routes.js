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
  var geoadminarea = require('../routes/geoadminarea');
  app.get( '/geo/:aaid', geoadminarea.index );
  app.get( '/geo/:aaid/json/children', geoadminarea.get_children );
  app.get( '/geo/:aaid/json', geoadminarea.get );

  /**
   * Users
   */
  var user = require('../routes/user');
  app.get('/users', user.list);

  /**
   * home / front page route
   */
  app.get('/', geoadminarea.index);
}
