$(document).ready(function() {
  
  $('.ajax').not('ajax-processed').each(function(index) {
    var $self = $(this);
    var request = $self.attr('data-request');
    var id = $self.attr('data-id');
    
    $.ajax({
      type : "POST",
      url : '/' + request,
      data : { 'id' : id },
    }).done(function(res) {
      $self.html(res);
      
      $self.addClass('ajax-processed');
    });
  });

});