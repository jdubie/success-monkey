// javascript for index.html
var emailRegex = /\w+@\w+\.\w+/;

$(document).ready(function() {
  for (var i = 1; i < 6; i++) {
    $('#reviewers').append(ich.reviewer({emailName: 'email' + i}));
  }
});

//carousel should not be on auto
$('#reviewCarousel').carousel({
  interval: false
});

// clicking the "Ask >>" button
$('button.ask').click(function(e) {
  var yourEmail = $('[name=your-email]').val();
  console.log('yourEmail', yourEmail);
  if (emailRegex.test(yourEmail)) {
    console.log('your email checks');
    var reviewerEmails = [];
    for (var i = 1; i < 6; i++) {
      var reviewerEmail = $('[name=email' + i + ']').val();
      if (emailRegex.test(reviewerEmail)) {
        reviewerEmails.push(reviewerEmail);
      }
    }
    console.log('reviewerEmails', reviewerEmails);
    $('#competencies').html('');
    for (var i = 0; i < reviewerEmails.length; i++) {
      $('#competencies').append(ich.competencyForm({emailName: reviewerEmails[i]}));
    }
    $('#reviewCarousel').carousel('next');
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
