// Stuff to always run:
$(window).resize(function(){ set_map_height(); });
$(document).ready(function() {
  // Init!
  set_sidebar_height();
  set_map_height();

});

/***********************************************************/
// HELPERS
/***********************************************************/

/*
 * Resizes the sidebar based on the size of the window.
 */
function set_sidebar_height() {
  // Resize only if window > 850
  var $window = $(window);
  if ($window.width() <= 850){
    return false;
  }

  var w_height = $window.height();
  var $sidebar = $('#sidebar');
  var oh_header = $('#header').outerHeight(true);
  var oh_sidebar = $sidebar.outerHeight(true);
  var oh_footer = $('#footer').outerHeight(true);

  // If all the sidebar elements together don't match the window height
  // adjust the sidebar.
  if (oh_header + oh_sidebar + oh_footer < w_height) {
    // We are setting the height for the sidebar. We need to account for
    // the outer height like padding, border...
    var final_height = w_height - oh_footer - oh_header - (oh_sidebar - $sidebar.height());
    $sidebar.css('min-height', final_height);
  }
}

/*
 * Resizes the map based on the height of the sidebar.
 */
function set_map_height() {
  // Resize only if window > 850
  if ($(window).width() <= 850){
    return false;
  }
  var oh_header = $('#header').outerHeight(true);
  var oh_sidebar = $('#sidebar').outerHeight(true);
  var oh_footer = $('#footer').outerHeight(true);

  $('.map').height(oh_header + oh_sidebar + oh_footer);
}

/**
 * @param string url
 * @return json data
 *   The data from the database.
 */
function get_json(url) {
  var data = null;
  $.ajax({
    type : "GET",
    url : url,
    async : false,
    dataType : "json",
    context : document.body
  }).done(function(response) {
    data = response;
  });

  return data;
}

/**
 * @param string url
 * @param function cb
 *   Callback for when the request is completed.
 * @return json data
 *   The data from the database.
 */
function get_json_cb(url, cb) {
  var data = null;
  $.ajax({
    type : "GET",
    url : url,
    dataType : "json",
    context : document.body
  }).done(function(response) {
    cb(response);
  });
}

/**
 * Get the aaid from the URL
 * @return aaid [int]
 *
 * @todo change this when we have final API paths
 */
function get_requested_aaid() {
  return Incendios.info.aaid;
}

/**
 * Replaces args in the string. This does not take into account
 * word boundaries so make sure that a arg does not contain another.
 * :example -- :example_word
 *
 * @param string string
 * @param object args
 *
 * @return string
 */
function string_format(string, args) {
  for (var arg in args) {
    var regExp = new RegExp(arg, 'g');
    string = string.replace(regExp, args[arg]);
  }
  return string;
}

/**
 * Formats numbers according to the Portuguese notation:
 * 1 000 000,25
 *
 * @param Number num
 * @return Number
 */
function number_format(num) {
  var regexp = /(?=(?:\d{3})+$)(?!^)/g;
  var integer = /^[0-9]+$/;
  if (integer.test(num)) {
    return num.toString().replace(regexp, ' ');
  }
  else {
    var pieces = num.toString().split('.');
    var formatted = pieces[0].replace(regexp, ' ');
    return formatted + ',' + pieces[1];
  }
}


/**
 * Translates a string using the server side.
 *
 * @param string to be translated
 * @return translated string
 *
 * @todo support arguments
 * @todo use socket.io?
 */
function t(string) {
  var response = null;

  if (string) {
    $.ajax({
      type : "POST",
      url : '/t',
      data : { raw : string },
      async : false,
      dataType : "json"
    }).done(function(res) {
      response = res;
    });
  }

  return response.translated || string;
}
