// javascript for index.html
var EMAIL_REGEX = /\w+@\w+\.\w+/;
var DEFAULT_REVIEWERS = 3;

var numReviewers = 0;
var yourEmail;
var yourName;
var reviewType;
var reviewerEmails;
var reviewerRelationships;
var task;

var PROD = ['test.thelifeswap.com', 'groundfloorlabs.com', 'www.groundfloorlabs.com'].indexOf(window.location.hostname) !== -1

var initializeReviewers = function() {
  $('#reviewers').html('');
  numReviewers = 0;
  for (var i = 0; i < DEFAULT_REVIEWERS; i++) {
    $('#reviewers').append(ich.reviewer({emailName: 'email' + numReviewers}));
    numReviewers++;
  }
}

$(document).ready(function() {
  initializeReviewers();
  if (PROD) mixpanel.track('arrived home');
});

//carousel should not be on auto
$('#reviewCarousel').carousel({interval: false});

var renderErrors = function(errors) {
  for (var i in errors) {
    var ctrlGroup = '.control-group.' + errors[i];
    $(ctrlGroup).addClass('error');
    $(ctrlGroup + ' .help-inline').html('<img src="img/red-x.png"></img>');
  };
};

var resetErrors = function() {
  $('.control-group').removeClass('error');
  $('.control-group .help-inline').html('');
}

$('button.add-reviewer').click(function(e) {
  e.preventDefault();
  $('#reviewers').append(ich.reviewer({emailName: 'email' + numReviewers}));
  numReviewers++;
});

$('[name=reviewType]').click(function(e) {
  $('div.reviewers-fields').show('linear');
  $('button.ask').show('linear');
});

// clicking the "Ask >>" button
$('button.ask').click(function(e) {
  resetErrors();
  if (PROD) mixpanel.track('clicked ask');
  yourEmail = $('[name=your-email]').val();
  yourName = $('[name=your-name]').val();
  reviewType = $('[name=reviewType]:checked').val();
  reviewerEmails = [];
  reviewerRelationships = [];
  task = null;

  var errors = [];

  // verify your (reviewee) email
  if (!EMAIL_REGEX.test(yourEmail)) errors.push('reviewee-info');
  for (var i = 0; i < numReviewers; i++) {
    var emailName = 'email' + i;
    var reviewerEmail = $('[name=' + emailName + ']').val();

    if (EMAIL_REGEX.test(reviewerEmail)) {
      reviewerEmails.push(reviewerEmail);
      var selector = '[name=relationship_email' + i + '] option:selected';
      var relationship = $(selector).val();
      reviewerRelationships.push(relationship);
    } else if (reviewerEmail) {
      errors.push(emailName);   // email exists, but error!
    }
  }

  if (reviewType === 'task') {
    task = $('[name=task]').val();
    if (!task) errors.push('task-type');
  }

  if (errors.length > 0) {
    renderErrors(errors);
    return;
  }

  console.log('yourEmail', yourEmail);
  console.log('reviewerEmails', reviewerEmails);
  console.log('reviewerRelationships', reviewerRelationships);

  if (reviewType === 'task') {
    $('#review-type').html(ich.taskReview());
  } else if (reviewType === 'general') {
    $('#review-type').html(ich.generalReview());
  }
  if (PROD) 
    mixpanel.track('review type chosen', {reviewType: reviewType});
  $('#reviewCarousel').carousel('next');
});

// clicked "Send!"
$('button.send').click(function(e) {

  var data = {
    name: yourName,
    from: yourEmail,
    to: reviewerEmails,
    relationships: reviewerRelationships,
    emailSent: false
  };
  if (reviewType === 'task') {
    data.task = $('[name=task]').val()
  } else if (reviewType === 'general') {
    data.areas = [];
    $('input:checkbox[name="competencies"]:checked').each(function() {
      data.areas.push($(this).val());
    });
  }
  console.log('data', data);

  if (PROD) {
    mixpanel.track('clicked send', data);

    var ReviewRequestObject;
    if (reviewType === 'task') {
      ReviewRequestObject = Parse.Object.extend("ReviewRequestTaskObject");
    } else if (reviewType === 'general') {
      ReviewRequestObject = Parse.Object.extend("ReviewRequestGeneralObject");
    }
    var reviewRequest = new ReviewRequestObject();
    reviewRequest.save(data, {
      success: function(obj) {
        console.log('saved review request', obj);
      }
    });
  }
  $('#reviewCarousel').carousel('next');
});

$('button.finished').click(function(e) {
  // clear reviewers
  initializeReviewers();
  $('#reviewCarousel').carousel('next');
});

// HR request
$('.btn.hr-request').click(function(e) {
  var hrEmail = $('[name=hr-email]').val();
  console.log('hr request:', hrEmail);
  if (PROD) {
    var HRRequestObject = Parse.Object.extend("HRRequestObject");
    var hrRequest = new HRRequestObject();
    hrRequest.save({email: hrEmail}, {
      success: function(obj) {
        console.log('saved review request', obj);
      }
    });
  }
  $('[name=hr-email]').val('');
  $('[name=hr-email]').attr('placeholder', 'Thanks!');
});
