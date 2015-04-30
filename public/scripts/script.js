(function(){
  
  var $btnToSection = $(".btn-to-section"); //nav links have this class
  var $wrapperLR = $('.wrapper-l, .wrapper-r'); // that wrap header, navigation, and main container
  var $section = $('section');
  var $btnToHome = $('.btn-to-home'); // mobile close btn and home link have this class
  var $closebtn = $('.closebtn'); // mobile close btn and home link have this class
  var $projectlink = $('#work li a'); // need to add event to this twice (for Ajax and Pageload)

  // Duration of animation btween wrapperLR
  var animationDurationProperty = $wrapperLR.css('transition-duration');
  var animationDuration = 1000 * parseFloat(animationDurationProperty.replace('s',''));

  /*
  * Open the window to show the project detail on #work section
  */

  var height = 50;
  var openProjectDetail = function(e){

    e.preventDefault();

    var loadingDuration = 720;
    var wait = 300; //To load innerHeight of #ajaxheight
    var url =  $(this).attr('href');
    var $body = $('body, html');
    var $ajaxdataContainer = $('.ajaxdata-container');
    console.log(url);

    var startProjectAnimation = function(data){

      var part = $(data).find('#ajaxdata > *');
      console.log(part);

      $body.animate( {scrollTop:0}, loadingDuration);
      $('.ajaxdata-container').animate({ height : height + 'px'}, loadingDuration);
      $('#ajaxdata').animate({ opacity:0 }, loadingDuration, function(){
        $('#ajaxdata').html(part);
        console.log('height');
        setTimeout(function(){
          $('#close-project-detail').on('click', closeProjectDetail); //To register event when loaded
          $('#ajaxdata').animate({ opacity:1 }, loadingDuration);
          height = $('#ajaxdata').innerHeight();
          height = height + "px";
          console.log(height);
          $('.ajaxdata-container').animate({ height : height }, loadingDuration );
          history.pushState({},"", url);
        }, wait);
      });
    }

    $.ajax({
      url: url,
      data : {ajax : true},
      dataType : 'html'
      //beforeSend : startAnimation
    }).done(startProjectAnimation)
      .fail(function(){alert('error');})
  }

  var closeProjectDetail = function(){
    $('.ajaxdata-container').animate({ height:0 }, 500);
    height = 50;
  }

  /*
  * Moving Animation to go to a section in main page.
  */
  var openSection = function(e){
    height = 50;
    var complete = function(data){
      //var part = $(data).find('section');
      $('#section-container').css({height:"100vh"})

      var datapart = $(data).find('section');
      console.log(datapart);
      //$('#section-container').html(datapart);

      //console.log(part);
      $('.main-container')
      .append('<embed src="images/loadingGIF/spin.svg" type="image/svg+xml" style="position:absolute; top:45%; left: 50%; z-index: 9999;" />')
      
      $('#section-container')
      .html(data)
      .children()
      .hide()
      //.fadeOut(400,function(){$(this).html(data)});
      //.html(data)

      setTimeout(function(){ 
          $projectlink = $('#work li a');
          $projectlink.on('click', openProjectDetail);

          $('#section-container').children().fadeIn(250);
          $('.main-container embed').remove();
          $('#section-container').css({height:"auto"})
      }, 500)

      //This prevents the page from being at the top when going to main
      if(! $wrapperLR.hasClass('main-on')){
        $wrapperLR.addClass('main-on keepstate-forth');
        $closebtn.addClass('main-on');
        setTimeout(function(){
          $wrapperLR.removeClass('keepstate-forth');
          $(window).scrollTop(0);
        }, animationDuration);
      }
      else{
          $(window).scrollTop(0);
      }

      history.pushState({},"", url);
    }


    // To mark the only link selected
    var $selectedLink = $(this);
    var $unselectedLink =$btnToSection.not($selectedLink);
    $selectedLink.addClass('selected');
    $btnToHome.removeClass('selected');
    $unselectedLink.removeClass('selected');

    e.preventDefault();
    var url = $(this).attr('href');
    console.log(url);
    $('.ajaxdata-container').css({ height : '0px' });
    //$('#section-container').load(url, {ajax : true} ,function(){console.log('hey')} );
    $.ajax({
      url:url,
      data : {ajax : true},
      dataType: 'html'
    }).done(complete);
  }

  /*
  * Moving Animation to go to home page.
  */
  var backToHome = function(){

    if($wrapperLR.hasClass('main-on')){
      $wrapperLR.addClass('keepstate-back');
      $('body').addClass('keepstate-back');
      $wrapperLR.removeClass('main-on');
      $closebtn.removeClass('main-on');

      setTimeout(function(){
        $section.removeClass('active');
        $wrapperLR.removeClass('keepstate-back');
        $('body').removeClass('keepstate-back');
        $(window).scrollTop(0);
      }, animationDuration);
    }

    $btnToHome.not($closebtn).addClass('selected');
    $btnToSection.removeClass('selected');
  }

  $btnToSection.on('click', openSection);

  $btnToHome.on('click', backToHome);

  $projectlink.on('click', openProjectDetail);

  $('#close-project-detail').on('click', closeProjectDetail);
})();

/*

  // To show the page clicked
  var $sectionId = $(this).data("sectionId");
  var $selectedSection = $($sectionId);
  $selectedSection.addClass("active");

  // To hide the pages not clicked
  var $unselectedSections = $('section:not(' + $sectionId + ')');
  $unselectedSections.removeClass('active');
*/
