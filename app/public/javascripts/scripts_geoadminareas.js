$(document).ready(function() {

  var aaid = get_requested_aaid();
  var stats_admin_area = get_json('/api/v1/stats/' + aaid + '/json');
  var admin_area = get_json('/api/v1/geo/' + aaid + '/json');

  /**************************************************/
  // Create the map.
  /**************************************************/
  // *** Base Map
  var southWest = new L.LatLng(35, -14),
  northEast = new L.LatLng(45, -1.5),
  bounds = new L.LatLngBounds(southWest, northEast);
  var map = L.mapbox.map('map', 'flipside.map-epnw0q4t', {minZoom: 7, maxZoom: 14, maxBounds : bounds}).setView([40, -74.50], 9);

  // Disable double click zoom.
  map.doubleClickZoom.disable();

  // *** Layer. Tiles of Administrative borders.
  map.addLayer(L.mapbox.tileLayer('flipside.pt-admin-areas'));

  // *** Layer. Grid of administrative borders. Used for interactivity.
  // Changes location upon click. Depends on zoom level.
  var grid_layer = L.mapbox.gridLayer('flipside.pt-admin-areas');
  // Setup the interactivity.
  grid_layer.on('click', function(data){
    if (typeof data.data == 'undefined') {
      //Nothing to do here!
      return;
    }

    // We assume that the aaid always has 6 digits.
    if (map.getZoom() <= 9) {
      // Distrito.
      var destination = data.data.AAID.substring(0,2);
    }
    else if (map.getZoom() >= 10 && map.getZoom() <= 12) {
      // Concelho.
      var destination = data.data.AAID.substring(0,4);
    }
    else {
      // Freguesia.
      var destination = data.data.AAID;
    }

    window.location.href = '/' + Incendios.page_meta.lang + '/por/' + destination;
  });
  // Add layer to map.
  map.addLayer(grid_layer);

  // *** Layer. Tiles of occurrences layer.
  var tile_layer_occurrences = L.mapbox.tileLayer('flipside.if_occurrences')
  // Add layer to map.
  map.addLayer(tile_layer_occurrences.setZIndex(999));

  // *** Layer. Grid of occurrences layer. Used to show popup with data.
  var grid_layer_occurrences = L.mapbox.gridLayer('flipside.if_occurrences');
  map.addLayer(grid_layer_occurrences);

  // Grid control to show popup with occurrences data.
  // Only add grid control after occurrences_tile_layer is loaded because
  // we need to get the template from that layer.
  var template_loaded = false;
  tile_layer_occurrences.on('load', function(){
    if (template_loaded) {
      return;
    }
    template_loaded = true;
    map.addControl(L.mapbox.gridControl(grid_layer_occurrences, {
      // Template from occurrences_tile_layer layer.
      template : tile_layer_occurrences.getTileJSON().template,
      pinnable : false
    }));
  });

  // Fit bounds.
  var southWest = new L.LatLng(admin_area.geo.min.y, admin_area.geo.min.x);
  var northEast = new L.LatLng(admin_area.geo.max.y, admin_area.geo.max.x);
  var bounds = new L.LatLngBounds(southWest, northEast);

  map.fitBounds(bounds);

  map.legendControl.addLegend($('.legend-if-detailed-occurrence').html());


  /**************************************************/
  // END map.
  /**************************************************/

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
    labels: [t('incendio'), t('fogacho'), t('agricola'), t('queimada'), t('falso_alarme')],

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
    labels: [t('burnt area')],

    hideHover : 'auto',
    lineColors: ['#782121'],
    pointFillColors: ['#c0392b'],

    yLabelFormat : function(y){
      return number_format(y) + ' Ha';
    }
  });

  // This must be the last thing to do because the
  // content will change the sidebar height.
  set_map_height();


  /**************************************************/
  // Table.
  /**************************************************/
  //Prepare jTable
  $('#od-table').jtable({
    title: 'Table of people',
    ajaxSettings : {
      type : 'GET',
      dataType : 'json',
    },
    paging: true,
    pageSize: 10,
    sorting: true,
    defaultSorting: 'Date DESC',
    actions: {
      listAction: '/occurrencedetails/' + aaid + '/jt_json',
    },
    fields: {
      line : {
        title: '#',
      },
      codigo: {
        title: t('ICNF Code'),
        key: true,
      },
      classificacao: {
        title: t('Classification'),
      },
      distrito: {
        title: t('Distrito'),
      },
      concelho: {
        title: t('Concelho'),
      },
      freguesia: {
        title: t('Freguesia'),
      },
      aa_total: {
        title: t('Burnt area'),
      },
      data_alerta: {
        title: t('Date'),
      }
    }
  })

  //Load person list from server
  $('#od-table').jtable('load')

});
