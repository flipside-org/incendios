// global vars
var $breadcrumbs = $('#breadcrumbs').find('select.chzn-select');

$breadcrumbs.first().chosen(
  {
    no_results_text: "No results matched for",
    allow_single_deselect: false,
  })
  .change(function(){
    // similar behavior as clicking on a link
    var url = $(this).val();
    window.location.href = url;
  });

// "chosenify" breadcrumbs
$breadcrumbs.not(':first').each(function() {
  $(this)
    .chosen({
      no_results_text: "No results matched for",
      allow_single_deselect: true,
    })
    .change(function(){
      var url = '';
      if ($(this).val() == '') {
        url += $(this).prevAll('select:first').val();
      }
      else {
        url += $(this).val();
      }
      // similar behavior as clicking on a link
      window.location.href = url;
    });
});
