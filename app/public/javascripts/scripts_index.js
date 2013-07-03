$(document).ready(function() {
  /**************************************************/
  // Create the map.
  /**************************************************/
  var southWest = new L.LatLng(35, -11.5),
  northEast = new L.LatLng(44, -3),
  bounds = new L.LatLngBounds(southWest, northEast);
  var map = L.mapbox.map('map', 'flipside.if_detailed_heatmap', {minZoom: 7, maxZoom: 14, maxBounds : bounds}).setView([40, -7.5], 6);
  L.mapbox.tileLayer('flipside.map-epnw0q4t').setZIndex(-1).addTo(map);
  map.doubleClickZoom.disable();
  
  var yearstatus = get_json('/yearstatuses/json');
  // Morris issue #242. With the line chart the years must be strings
  var parsed = Array();
  $.each(yearstatus, function(index, year) {
    year.year = year.year.toString();
    parsed.push(year);
  });
  
  var burn_area_chart = new Morris.Line({
    // ID of the element in which to draw the chart.
    element: 'burnt-area-country',
    // Chart data records -- each entry in this array corresponds to a point on
    // the chart.
    data: yearstatus,
    // The name of the data record attribute that contains x-values.
    xkey: 'year',
    // A list of names of data record attributes that contain y-values.
    ykeys: ['aa_total'],
    // Labels for the ykeys -- will be displayed when you hover over the
    // chart.
    labels: [t('burnt area')],

    hideHover : 'auto',
    lineColors: ['#782121'],
    pointFillColors: ['#c0392b'],

    yLabelFormat : function(y){
      return number_format(y) + ' Ha';
    }
  });
  // TODO: uncomment.
  //$(window).resize(function(){ burn_area_chart.redraw(); });
  
  // This must be the last thing to do because the
  // content will change the sidebar height.
  set_map_height();
  
});