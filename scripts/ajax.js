$(document).ready(function(){

  $('#ajaxtest3').on('click', function(e){
    e.preventDefault();
    var pageurl = $(this).attr('href');
    var value = $(this).data('val');
    var success = function (data) {
        //console.log(data);
        $data = $(data).find('#pjax');
        console.log($data);
        $('.result').html($data.html());
    }

    $.ajax({
      url: pageurl,
      data : value,
      success : success,
    })
    .done(function(){
      console.log('hey');
    });
  });

});