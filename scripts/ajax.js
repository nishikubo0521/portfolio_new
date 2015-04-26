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
    server: {query : { val : $('this').data('index') }}
});

//$('a').pjax({area : '#ajaxdata'}).click();
//$('a').on('click', $.pjax );

});