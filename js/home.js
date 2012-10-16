// javascript for index.html

//carousel should not be on auto
$('#reviewCarousel').carousel({
  interval: false
});

// clicking the "Ask >>" button
$('button.ask').click(function(e) {
  var reviewerEmail = $('[name=reviewer-email]').val();
  var yourEmail = $('[name=your-email]').val();
  if (reviewerEmail !== '') {
    $('label.reviewer').text(reviewerEmail);
    if (yourEmail !== '') {
      $('#reviewCarousel').carousel('next');
    }
  }
});

// clicking the "Send!" button
$('button.send').click(function(e) {
  // get the array of customizations requested
  var customizations = [];
  $('input:checkbox[name="competency"]:checked').each(function(index) {
    customizations.push($(this).val());
  });
  // move on
  $('#reviewCarousel').carousel('next');
});

$('.carousel-next').click(function(e) {
  $('#reviewCarousel').carousel('next');
});

$('.carousel-prev').click(function(e) {
  $('#reviewCarousel').carousel('prev');
});

//$('button.add-reviewer').click(function(e) {
//  $()
//});
