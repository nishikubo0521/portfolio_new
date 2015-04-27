$(document).ready(function(){
  /*
  $('#ajaxtest3, #ajaxdata a').on('click', function(e){
    e.preventDefault();
    var pageurl = $(this).attr('href');
    var value = { index : $(this).data('val')};
    console.log(value);
    var success = function (data) {
        //console.log(data);
        $data = $(data).find('#pjax');
        console.log($data);
        //$('.result').html($data.html());
    }

    $.ajax({
      url: pageurl,
      data : value
    })
    .done(function(){
      console.log('hey');
    });
  });
  */
/*
$('#work li a').on('click', function(){
});
*/

$.pjax({
    link:'#work li a',
    area: '#ajaxdata',
    wait: 1200,
    scrollTop: false
    //server: {query : { val : $('this').data('index') }}
});

$(document).bind('pjax:fetch', function () {
  $('.ajaxdata-container').removeClass('pjax-rendered');
  $('.ajaxdata-container').addClass('pjax-fetch');
  $('html,body').animate({scrollTop:0},500);
});

$(document).bind('pjax:render', function () {
  $('.ajaxdata-container').addClass('pjax-render');
});

$(window).bind('pjax:load', function () {
  $('.ajaxdata-container').removeClass('pjax-fetch');
  $('.ajaxdata-container').removeClass('pjax-render');
  $('.ajaxdata-container').addClass('pjax-rendered');
});

});