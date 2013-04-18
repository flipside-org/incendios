// global vars
var $breadcrumbs = $('#breadcrumbs')
  , pointer = get_requested_aaid()
  , pointer_child = pointer
  , count = 1;

// hide sample select list
var $sample_select = $('#breadcrumb-select-sample').hide();

// get data and populate
while (pointer != null) {
  breadcrumb_do(pointer);
}


/**
 * Construct the geographical breadcrumb.
 */
function breadcrumb_do(aaid) {

  // creates the breadcrumb select list
  // clone step element
  var $select_template = $sample_select.clone(true).removeAttr('id');
  // set the correct ID
  var breadcrumb_id = 'breadcrumb-select-' + aaid;
  $select_template.attr('id', breadcrumb_id);
  $breadcrumbs.prepend($select_template);

  // load the admin areas for that pointer and process them
  $.ajax({
    type: "GET",
    url: '/geo/' + aaid + '/json/children',
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
      // build it!
      $breadcrumbs.find('#' + breadcrumb_id).append('<option value="' + this.aaid + '">' + this.name + '</option> ');

      // whether or not we want to select the option
      if (pointer_child == this.aaid) {
        $breadcrumbs.find('#' + breadcrumb_id).find('option[value="' + this.aaid + '"]').attr('selected', 'selected');
      }

    });

    // "chosenify" it
    $breadcrumbs
      .find('#' + breadcrumb_id)
      .chosen({
        no_results_text: "No results matched for",
        allow_single_deselect: false
      })
      .change(function(){
        // similar behavior as clicking on a link
        var url = '/geo/' + $(this).val();
        window.location.href = url;
      });

  });

  // we are updating the pointer_child to select in the next iteration
  pointer_child = pointer;

  // get own object and update pointer
  if (aaid != 0) {
    $.ajax({
      type: "GET",
      url: '/geo/' + aaid + '/json',
      async: false,
      dataType: "json",
      context: document.body
    }).done(function(admin_area) {
      if (admin_area && 'parent_id' in admin_area) {
        pointer = admin_area.parent_id
      }
      else {
       pointer = null;
      }

    });
  }
  else {
    pointer = null;
  }


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
