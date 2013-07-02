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
  
  
  
  // Init all chosen selects
  // Store the location selection.
  var aaid_selection = {
    distrito : 0,
    concelho : 0,
    freguesia : 0,
    
    get : function(){
      return this.freguesia || this.concelho || this.distrito;
    }
  }
  // DISTRITO.
  $('#location-browse-distrito').chosen({
      no_results_text: "No results matched for",
  })
  .change(function(){
    // When changing distrito, clear freguesia.
    $('#location-browse-freguesia').html('').trigger("liszt:updated");
    // Store selected value.
    aaid_selection.distrito = $(this).val();
    get_options($(this).val(), function(response){
      $('#location-browse-concelho').html(response).trigger("liszt:updated");
    });
  });
  
  // CONCELHO.
  $('#location-browse-concelho').chosen({
      no_results_text: "No results matched for",
      allow_single_deselect: true,
      disable_search_threshold: 5
  })
  .change(function(){
    // Store selected value.
    aaid_selection.concelho = $(this).val();
    
    if (!$(this).val()) {
      // When clearing concelho, clear also freguesia
      aaid_selection.freguesia = 0;
      $('#location-browse-freguesia').html('').trigger("liszt:updated");
      return;
    }
    
    get_options($(this).val(), function(response){
      $('#location-browse-freguesia').html(response).trigger("liszt:updated");
    });
  });
  
  // FREGUESIA.
  $('#location-browse-freguesia').chosen({
      no_results_text: "No results matched for",
      allow_single_deselect: true,
      disable_search_threshold: 5
  })
  .change(function(){
    // Store selected value.
    aaid_selection.freguesia = $(this).val();
  });
  
  
  // Populate distrito. First request has parent 0.
  get_options(0, function(response){
    $('#location-browse-distrito').html(response).trigger("liszt:updated");
  });
  
  $('#location-browse-submit').click(function(){
    var aaid = aaid_selection.get();
    if (aaid != 0) {
      window.location.href = Incendios.page_meta.lang + '/por/' + aaid;
    }
  });
  
  // This must be the last thing to do because the
  // content will change the sidebar height.
  set_map_height();
  
});



function get_options(parent_id, callback) {
  $.ajax({
    type : "get",
    // First request has parent 0.
    url : 'listlocationoptions/' + parent_id,
    dataType : "html",
  }).done(function(response) {
    callback(response);
  });
}
