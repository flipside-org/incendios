$(document).ready(function() {
  if ( $('#location-browse-concelho').length == 1) {
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
        window.location.href = '/' + Incendios.page_meta.lang + '/por/' + aaid;
      }
    });
    
    // This must be the last thing to do because the
    // content will change the sidebar height.
    set_map_height();
  }
  
});

function get_options(parent_id, callback) {
  $.ajax({
    type : "get",
    // First request has parent 0.
    url : '/listlocationoptions/' + parent_id,
    dataType : "html",
  }).done(function(response) {
    callback(response);
  });
}
