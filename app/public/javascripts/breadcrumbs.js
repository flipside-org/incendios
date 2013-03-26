// global vars
var $breadcrumbs = $('#breadcrumbs')
  , pointer = 0;

// get data and populate
breadcrumb_do();

/**
 * Construct the geographical breadcrumb.
 */
function breadcrumb_do() {

  // creates the breadcrumb select list
  var breadcrumb_id = 'breadcrumb-select-' + pointer;
  $breadcrumbs.append('<select id="' + breadcrumb_id + '" class="chosen-select" data-placeholder="Choose a Distrito..."></select>');

  // load the admin areas for that pointer and process them
  $.ajax({
    type: "GET",
    url: 'geo/' + pointer + '/json',
    async: false,
    dataType: "json",
    context: document.body
  }).done(function(admin_areas) {
    // prevent showing empty selects
    if(!admin_areas.length) {
      $('#' + breadcrumb_id).remove();
      return;
    }

    // read through the json data
    $.each(admin_areas, function() {
      $breadcrumbs.find('#' + breadcrumb_id).append('<option value="' + this.aaid + '">' + this.name + '</option> ');
    });

    // "chosenify" it
    $breadcrumbs
      .find('#' + breadcrumb_id)
      .chosen({
        no_results_text: "No results matched for",
        allow_single_deselect: true
      })
      .change(function(){
        // update global pointer
        var selected = $(this).val();
        pointer = selected;
        // load up children
        breadcrumb_do();
      });
  });
}
