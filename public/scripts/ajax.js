$(document).ready(function(){

  $.pjax({
      link:'#work li a',
      area: '#ajaxdata',
      wait: 1500,
      scrollTop: false
  });

  var height = 0;
  var px = "";

  $(document).bind('pjax:fetch', function () {
    $('html,body').animate( {scrollTop:0}, 500);
    $('.ajaxdata-container').animate({
      height : '100px',
      opacity : 0
    },500);
  });

  $(window).bind('pjax:load', function () {
    height = $('#ajaxdata').innerHeight();
    px = height + "px";
    console.log(px);
    $('.ajaxdata-container').animate({
      height : px,
      opacity : 1.0
    }, 500);
  });

});