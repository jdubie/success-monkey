// javascript for index.html

$('button.ask').click(function(e) {
  $('.email1').text($('[name=email1]').val());
  //$('.email2').text($('[name=email2]').val());
  //$('.email3').text($('[name=email3]').val());
});
//$('button.add-reviewer').click(function(e) {
//  $()
//});
$('#reviewCarousel').carousel({
  interval: false
});
$('.carousel-next').click(function(e) {
  $('#reviewCarousel').carousel('next');
  e.preventDefault();
});
$('.carousel-prev').click(function(e) {
  $('#reviewCarousel').carousel('prev');
  e.preventDefault();
});
//$('#reviewCarousel').on('slid', function(a, b ,c) {
//  console.log(a, b, c);
//});
