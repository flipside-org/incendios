$(document).ready(function(){
  
  var map = L.mapbox.map('map', 'examples.map-vyofok3q');
  
  var aaid = get_requested_aaid();
  $.ajax({
    type: "GET",
    url: '/geo/' + aaid + '/json',
    async: false,
    dataType: "json",
    context: document.body
  }).done(function(admin_areas) {
    
    //var south_west = new L.LatLng(admin_areas.minx, admin_areas.miny);
    //var north_east = new L.LatLng(admin_areas.maxx, admin_areas.maxy);

    //map.fitBounds(new L.LatLngBounds(south_west, north_east));
    
  });
  
});
