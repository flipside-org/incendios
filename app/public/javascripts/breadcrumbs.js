// global vars
var $breadcrumbs = $('#breadcrumbs').find('select.chzn-select');

// "chosenify" breadcrumbs
$breadcrumbs.each(function() {
  $(this)
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

// UI: now make sure new ones are unselected
// @todo this is working but Chosen keeps showing default!!
var $new_chosen = $('#breadcrumb_select_new_chzn');

$new_chosen.find('.result-selected').removeClass('result-selected');

