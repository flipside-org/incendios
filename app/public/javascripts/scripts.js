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
  map.doubleClickZoom.disable(); 
  //map.addLayer(L.mapbox.tileLayer('examples.map-4l7djmvo'));
  map.addLayer(L.mapbox.tileLayer('flipside.map-epnw0q4t'));
  map.addLayer(L.mapbox.tileLayer('flipside.pt-admin-areas'));
  // Interactivity.
  var grid_layer = L.mapbox.gridLayer('flipside.pt-admin-areas');
  grid_layer.on('click', function(data){
    if (typeof data.data == 'undefined') {
      //Nothing to do here!
      return;
    }
    
    // We assume that the aaid always has 6 digits.
    var destination = null;
    if (map.getZoom() <= 7) {
      // Distrito.
      destination = data.data.AAID.substring(0,2);
    }
    else if (map.getZoom() >= 8 && map.getZoom() <= 9) {
      // Conselho.
      destination = data.data.AAID.substring(0,4);
    }
    else {
      // Freguesia.
      destination = data.data.AAID;
    }
    
    window.location = '/geo/' + destination;
  });
  map.addLayer(grid_layer);
  

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
  //map.markerLayer.setGeoJSON(gj);
  // @todo: / remove markers
  
  // Some areas might not have occurrences. Ex 110615
  if (stats_admin_area == null) {
    return;
  }

  /**************************************************/
  // Charts.
  /**************************************************/
  new Morris.Bar({
    // ID of the element in which to draw the chart.
    element: 'fires-year',
    // Chart data records -- each entry in this array corresponds to a point on
    // the chart.
    data: stats_admin_area.data,
    barColors: ['#782121','#c0392b','#e67e22','#f1c40f', '#1abc9c'],
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
    lineColors: ['#782121'],
    pointFillColors: ['#c0392b']
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