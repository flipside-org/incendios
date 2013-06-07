
/*
 * GET home page.
 */

exports.view = function(req, res){
  res.render('index', {
    title: 'Incendios',
    page_meta : {
      type: 'index',
      url : req.url,
      full_url : req.headers.host + req.url
    },
  });
};
