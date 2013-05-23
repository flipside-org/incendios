$(window).resize(function(){ set_map_height(); });

$(document).ready(function() {
  // Init!
  set_sidebar_height();
  set_map_height();

  var aaid = get_requested_aaid();
  var stats_admin_area = get_json('/stats/' + aaid + '/json');
  var admin_area = get_json('/geo/' + aaid + '/json');

  /**************************************************/
  // Create the map.
  /**************************************************/
  var map = L.mapbox.map('map').setView([40, -74.50], 9);
  //map.addLayer(L.mapbox.tileLayer('examples.map-4l7djmvo'));
  map.addLayer(L.mapbox.tileLayer('flipside.map-epnw0q4t'));

  var southWest = new L.LatLng(admin_area.geo.min.y, admin_area.geo.min.x);
  var northEast = new L.LatLng(admin_area.geo.max.y, admin_area.geo.max.x);
  var bounds = new L.LatLngBounds(southWest, northEast);

  map.fitBounds(bounds);
  
  // @todo: remove markers.
  var gj = [{
    // this feature is in the GeoJSON format: see geojson.org
    // for the full specification
    type : 'Feature',
    geometry : {
      type : 'Point',
      // coordinates here are in longitude, latitude order because
      // x, y is the standard for GeoJSON and many formats
      coordinates : [admin_area.geo.min.x, admin_area.geo.min.y]
    },
    properties : {
      title : 'A Single Marker',
      description : 'Just one of me',
      // one can customize markers by adding simplestyle properties
      // http://mapbox.com/developers/simplestyle/
      'marker-size' : 'large',
      'marker-color' : '#0AF'
    }
  }, {
    // this feature is in the GeoJSON format: see geojson.org
    // for the full specification
    type : 'Feature',
    geometry : {
      type : 'Point',
      // coordinates here are in longitude, latitude order because
      // x, y is the standard for GeoJSON and many formats
      coordinates : [admin_area.geo.max.x, admin_area.geo.max.y]
    },
    properties : {
      title : 'A Single Marker',
      description : 'Just one of me',
      // one can customize markers by adding simplestyle properties
      // http://mapbox.com/developers/simplestyle/
      'marker-size' : 'large',
      'marker-color' : '#0AF'
    }
  }];

  // Add features to the map
  map.markerLayer.setGeoJSON(gj);
  // @todo: / remove markers
  
  // Some areas might not have occurrences. Ex 110615
  if (stats_admin_area == null) {
    return;
  }

  /**************************************************/
  // Verbose statistics.
  /**************************************************/
  var $stats_verbose = $('#stats_verbose');
  var sentence = 'Entre 2001 e 2011 registaram-se :occurrences ocorências :pp_admin_area de :admin_area. :top_year_year foi o ano mais grave tendo ardido :top_year_ha hectares. O maior incêndio que teve início :pd_admin_area ocorreu a :top_incendio_date consumindo :top_incendio_ha hectares.';

  // Date calculation.
  var top_incendio_date = new Date(stats_admin_area.top.incendio.date);
  var day = top_incendio_date.getDate();
  var month = top_incendio_date.getMonth();
  var year = top_incendio_date.getFullYear();
  var monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
  
  var admin_divisions = ['distrito', 'conselho', 'freguesia'];

  var args = {
    ':occurrences' : stats_admin_area.total,  
    ':admin_area' : admin_area.name,
    // Pronome pessoal and admin area.
    // 3 stands for freguesia
    ':pp_admin_area' : ((admin_area.type == 3) ? 'na ' : 'no ') + admin_divisions[admin_area.type-1],
    ':top_year_year' : stats_admin_area.top.year,
    // Pronome demonstrativo and admin area.
    // 3 stands for freguesia
    ':pd_admin_area' : ((admin_area.type == 3) ? 'nesta ' : 'neste ') + admin_divisions[admin_area.type-1],
    ':top_incendio_date' : day + ' de ' + monthNames[month] + ' de ' + year,
    ':top_incendio_ha' : stats_admin_area.top.incendio.aa_total
  };
  
  // Get area for top incêndio
  // Loop through data array to get correct year.
  $.each(stats_admin_area.data, function(index, data_year) {
    if (data_year.year == stats_admin_area.top.year) {
      args[':top_year_ha'] = Math.round(data_year.aa_total);
      return;
    }
  });
  
  $stats_verbose.text(string_format(sentence, args));


  /**************************************************/
  // Charts.
  /**************************************************/
  new Morris.Bar({
    // ID of the element in which to draw the chart.
    element: 'fires-year',
    // Chart data records -- each entry in this array corresponds to a point on
    // the chart.
    data: stats_admin_area.data,
    barColors: ['#c0392b','#f39c12','#e74c3c','#f1c40f', '#1abc9c'],
    // The name of the data record attribute that contains x-values.
    xkey: 'year',
    // A list of names of data record attributes that contain y-values.
    ykeys: ['incendio', 'fogacho', 'agricola', 'queimada', 'falso_alarme'],
    // Labels for the ykeys -- will be displayed when you hover over the
    // chart.
    labels: ['Incendio', 'Fogacho', 'Agricola', 'Queimada', 'Falso Alarme'],
  
    stacked: true,
    hideHover : 'auto'
  });
  
  // Morris issue #242. With the line chart the years must be strings
  var parsed = Array();
  $.each(stats_admin_area.data, function(index, year) {
    year.year = year.year.toString();
    parsed.push(year);
  });
  
  new Morris.Line({
    // ID of the element in which to draw the chart.
    element: 'burnt-area',
    // Chart data records -- each entry in this array corresponds to a point on
    // the chart.
    data: parsed,
    // The name of the data record attribute that contains x-values.
    xkey: 'year',
    // A list of names of data record attributes that contain y-values.
    ykeys: ['aa_total'],
    // Labels for the ykeys -- will be displayed when you hover over the
    // chart.
    labels: ['Burnt Area'],
  
    postUnits : ' Ha',
    hideHover : 'auto',
    lineColors: ['#2aa198'],
    pointFillColors: ['#268bd2']
  });
  
  // This must be the last thing to do because the
  // content will change the sidebar height.
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
  var oh_header = $('#header').outerHeight();
  var oh_sidebar = $sidebar.outerHeight();
  var oh_footer = $('#footer').outerHeight();
  
  // If all the sidebar elements together don't match the window height
  // adjust the sidebar.
  if (oh_header + oh_sidebar + oh_footer < w_height) { console.log(w_height);
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
  var oh_header = $('#header').outerHeight();
  var oh_sidebar = $('#sidebar').outerHeight();
  var oh_footer = $('#footer').outerHeight();
  
  $('#map').height(oh_header + oh_sidebar + oh_footer);
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
 * Get the aaid from the URL
 * @return aaid [int]
 *
 * @todo change this when we have final API paths
 */
function get_requested_aaid() {
  return window.location.pathname.split('/')[2];
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