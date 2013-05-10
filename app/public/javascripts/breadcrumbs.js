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

