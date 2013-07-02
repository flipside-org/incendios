$(document).ready(function() {
  /**************************************************/
  // Create the map.
  /**************************************************/
  var map = L.mapbox.map('map', 'flipside.map-epnw0q4t', {minZoom: 7, maxZoom: 14, gridLayer: false}).setView([40, -7.5], 6);
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
        
        res.features[index].properties['title'] = prop['data_alerta'];
        res.features[index].properties['description'] = '<strong>' + t('Area') + ':</strong> ' + number_format(prop['aa_total']) + ' Ha<br/><strong>' + t('Cause') + ':</strong> ' + prop['tipocausa'];
      }

      var v = L.mapbox.markerLayer(res).addTo(map);
      map.removeControl();
    });
      
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
  
  
  
  var offset = 20;
  $.ajax({
    type : "POST",
    data : {'offset': 0, 'num' : 20},
    url : '/experiment',
    dataType : "json",
    context : document.body
  }).done(function(response) {
    
    var parsed = Array();
    for (index in response) {
      parsed.push(response[index].properties);
    }
    console.log(parsed);
    var expChart = new Morris.Line({
      // ID of the element in which to draw the chart.
      element: 'testar',
      // Chart data records -- each entry in this array corresponds to a point on
      // the chart.
      data: parsed,
      // The name of the data record attribute that contains x-values.
      xkey: 'data_alerta',
      // A list of names of data record attributes that contain y-values.
      ykeys: ['aa_total'],
      // Labels for the ykeys -- will be displayed when you hover over the
      // chart.
      labels: [t('burnt area')],
  
      hideHover : 'auto',
      lineColors: ['#782121'],
      pointFillColors: ['#c0392b'],
      
      parseTime : false,
      
      yLabelFormat : function(y){
        return number_format(Math.round(y)) + ' Ha';
      }
    });
    // The chart may have changed the height.
    set_map_height();
    
    setTimeout(function() {
      chart_update(parsed, expChart, offset);
    }, 20);
    
  });
    

  
  // This must be the last thing to do because the
  // content will change the sidebar height.
  set_map_height();
  




function chart_update(parsed, expChart, offset) {
    $.ajax({
      type : "POST",
      data : {'offset': offset, 'num' : 1},
      url : '/experiment',
      dataType : "json",
      context : document.body
    }).done(function(response) {
      
      parsed.shift();
      parsed.push(response[0].properties);
      
      expChart.setData(parsed);
      
      if (offset > 100) return;
      
      offset++;
      
      //setTimeout(function() {
        chart_update(parsed, expChart, offset);
     // }, 20);
      
    });
  }
  
});