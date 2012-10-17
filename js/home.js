// javascript for index.html
var emailRegex = /\w+@\w+\.\w+/;
var numReviewers = 0;

$(document).ready(function() {
  $('#reviewers').append(ich.reviewer({emailName: 'email' + numReviewers}));
  numReviewers++;
});

//carousel should not be on auto
$('#reviewCarousel').carousel({
  interval: false
});

$('button.add-reviewer').click(function(e) {
  e.preventDefault();
  $('#reviewers').append(ich.reviewer({emailName: 'email' + numReviewers}));
  numReviewers++;
});

// clicking the "Send >>" button
$('button.send').click(function(e) {
  var yourEmail = $('[name=your-email]').val();
  var yourName = $('[name=your-name]').val();
  var task = $('[name=task]').val();
  var reviewerEmails = [];

  console.log('yourEmail', yourEmail);
  // verify your email
  if (emailRegex.test(yourEmail)) {
    for (var i = 0; i < numReviewers; i++) {
      var reviewerEmail = $('[name=email' + i + ']').val();
      if (emailRegex.test(reviewerEmail)) {
        reviewerEmails.push(reviewerEmail);
      }
    }
    if (task !== '') {
      var data = {
        name: yourName,
        email: yourEmail,
        task: task,
        reviewers: reviewerEmails
      };
      console.log('data', data);
      $('#reviewCarousel').carousel('next');
    }
  }
});

$('button.finished').click(function(e) {
  // clear reviewers and task
  $('#reviewers').html('');
  numReviewers = 0;
  $('#reviewers').append(ich.reviewer({emailName: 'email' + numReviewers}));
  $('#reviewCarousel').carousel('next');
});
