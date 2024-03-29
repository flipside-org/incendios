$(document).ready(function() {
  /**************************************************/
  // Create the map.
  /**************************************************/
  var southWest = new L.LatLng(35, -11.5),
  northEast = new L.LatLng(44, -3),
  bounds = new L.LatLngBounds(southWest, northEast);
  var map = L.mapbox.map('map', 'flipside.map-epnw0q4t', {minZoom: 7, maxZoom: 14, gridLayer: false, maxBounds : bounds}).setView([40, -7.5], 6);
  map.doubleClickZoom.disable();
  
  // Markers if any.
  if (Incendios.settings != null && typeof Incendios.settings.map.markers != "undefined") {
    var markers_id = Incendios.settings.map.markers;
    
    $.ajax({
      type : "POST",
      url : '/occurrencedetails/marker',
      data : { 'id' : markers_id },
      dataType : "json"
    }).done(function(res) {
      
      if (res == null) return;
      
      // Style markers.      
      for (index in res.features) {
        var prop = res.features[index].properties;
        res.features[index].properties['marker-color'] = '#c0392b';
        res.features[index].properties['marker-symbol'] = 'fire-station';
        res.features[index].properties['marker-size'] = 'large';

        res.features[index].properties['title'] = moment(prop.data['data_alerta']).format('YYYY-MM-DD');
        res.features[index].properties['description'] = '<strong>' + t('Area') + ':</strong> ' + number_format(prop.area_ardida['aa_total']) + ' Ha<br/><strong>' + t('Cause') + ':</strong> ' + prop.causa['tipocausa'];
      }

      var v = L.mapbox.markerLayer(res).addTo(map);
    });
      
  }
  
  // Layers if any.
  if (Incendios.settings != null && typeof Incendios.settings.map.layers != "undefined") {
    var layers = Incendios.settings.map.layers;
    
    L.mapbox.tileLayer(layers.tileLayer).setZIndex(999).addTo(map);
    
    if (typeof layers.gridLayer != "undefined") {
      var grid_layer = L.mapbox.gridLayer(layers.gridLayer);
      map.addLayer(grid_layer);
      map.addControl(L.mapbox.gridControl(grid_layer, {
        template : layers.gridLayerTemplate, 
        pinnable : false
      }));
    }

    if (typeof Incendios.settings.map.legend != "undefined" && $('.' + Incendios.settings.map.legend).length == 1) {
      map.legendControl.addLegend($('.' + Incendios.settings.map.legend).html());
    }
    
  }
  
  
  // #burnt-area-chart
  if ($('#burnt-area-chart').length == 1) {
    get_json_cb('/yearstatuses/json', function(yearstatus) {
      
      // Morris issue #242. With the line chart the years must be strings
      var parsed = Array();
      $.each(yearstatus, function(index, year) {
        year.year = year.year.toString();
        parsed.push(year);
      });
      
      new Morris.Line({
        // ID of the element in which to draw the chart.
        element: 'burnt-area-chart',
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
      // The chart may have changed the height.
      set_map_height();
    });
  }
  
  // #occurrences-chart
  if ($('#occurrences-chart').length == 1) {
    get_json_cb('/yearstatuses/json', function(yearstatus) {
      
      // Morris issue #242. With the line chart the years must be strings
      var parsed = Array();
      $.each(yearstatus, function(index, year) {
        year.year = year.year.toString();
        parsed.push(year);
      });
      
      new Morris.Line({
        // ID of the element in which to draw the chart.
        element: 'occurrences-chart',
        // Chart data records -- each entry in this array corresponds to a point on
        // the chart.
        data: parsed,
        // The name of the data record attribute that contains x-values.
        xkey: 'year',
        // A list of names of data record attributes that contain y-values.
        ykeys: ['total'],
        
        ymin : 'auto 10000',
        ymax : 'auto 50000',
        // Labels for the ykeys -- will be displayed when you hover over the
        // chart.
        labels: [t('occurrences')],
    
        hideHover : 'auto',
        lineColors: ['#782121'],
        pointFillColors: ['#c0392b'],
    
        yLabelFormat : function(y){
          return number_format(Math.round(y));
        }
      });
      // The chart may have changed the height.
      set_map_height();
    });
  }

  
  // This must be the last thing to do because the
  // content will change the sidebar height.
  set_map_height();
  
});