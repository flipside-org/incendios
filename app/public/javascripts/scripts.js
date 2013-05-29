$(document).ready(function() {

  var aaid = get_requested_aaid();
  var stats_admin_area = get_json('/stats/' + aaid + '/json');
  var admin_area = get_json('/geo/' + aaid + '/json');

  /**************************************************/
  // Create the map.
  /**************************************************/
  var map = L.mapbox.map('map', 'flipside.map-epnw0q4t', {minZoom: 7, maxZoom: 14}).setView([40, -74.50], 9);
  map.doubleClickZoom.disable(); 
  map.addLayer(L.mapbox.tileLayer('flipside.pt-admin-areas'));
  map.addLayer(L.mapbox.tileLayer('flipside.if_occurrences'));
  // Interactivity.
  var grid_layer = L.mapbox.gridLayer('flipside.pt-admin-areas');
  grid_layer.on('click', function(data){
    if (typeof data.data == 'undefined') {  
      //Nothing to do here!
      return;
    }
    
    // We assume that the aaid always has 6 digits.
    var destination = null;
    if (map.getZoom() <= 9) {
      // Distrito.
      destination = data.data.AAID.substring(0,2);
    }
    else if (map.getZoom() >= 10 && map.getZoom() <= 12) {
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
    hideHover : 'auto',
    
    yLabelFormat : function(y){
      return number_format(y);
    }
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
    pointFillColors: ['#c0392b'],
    
    yLabelFormat : function(y){
      return number_format(y);
    }
  });
  
  // This must be the last thing to do because the
  // content will change the sidebar height.
  set_map_height();
  
});
