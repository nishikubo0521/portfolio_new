$(document).ready(function(){

  $.pjax({
      link: 'a',
      area: '#section-container',
      scope: {
        '/': ['/', '#work'],
        work: ['/work/'],
        $work: { 
          link: 'a',
          area: '#section-container, #ajaxdata',
          wait: 2000,
          scrollTop: false
        }
      }
  });

  var height = 0;
  var px = "";
  var loadingDuration = 500;

  $(document).bind('pjax:fetch', function () {
    $('html,body').animate( {scrollTop:0}, loadingDuration);
    $('.ajaxdata-container').animate({ height : '50px'}, loadingDuration);
    $('#ajaxdata').animate({ opacity:0 }, loadingDuration);
  });

  $(window).bind('pjax:load', function () {
    height = $('#ajaxdata').innerHeight();
    px = height + "px";
    console.log(px);
    $('.ajaxdata-container').animate({ height : px }, loadingDuration);
    $('#ajaxdata').animate({ opacity:1 }, loadingDuration);
  });

});