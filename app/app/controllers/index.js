
/*
 * GET home page.
 */

exports.view = function(req, res){
  res.render('index', { title: 'Incendios', type : 'index' });
};
