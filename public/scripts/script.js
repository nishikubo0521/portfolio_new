(function(){
  
  var $btnToSection = $(".btn-to-section"); //nav links have this class
  var $wrapperLR = $('.wrapper-l, .wrapper-r'); // that wrap header, navigation, and main container
  var $mainContainer = $('.main-container');
  var $sectionContainer = $('#section-container');
  var $section = $('section');
  var $btnToHome = $('.btn-to-home'); // mobile close btn and home link have this class
  var $closebtn = $('.closebtn'); // mobile close btn and home link have this class
  var $projectlink = $('#work li a'); // need to add event to this twice (for Ajax and Pageload)

  // Duration of animation btween wrapperLR
  var animationDurationProperty = $wrapperLR.css('transition-duration');
  var animationDuration = 1000 * parseFloat(animationDurationProperty.replace('s',''));

  var height = 50; // Initial height of the project detail window when loading contents.

  /*
  * Open the window to show the project detail on #work section
  */
  var openProjectDetail = function(e){

    e.preventDefault();

    var loadingDuration = 720;
    var wait = 300; //To load innerHeight of #ajaxheight
    var url =  $(this).attr('href');
    var $body = $('body, html');
    var $ajaxdataContainer = $('.ajaxdata-container');
    console.log(url);

    var startProjectAnimation = function(data){
      var $ajaxdata = $('#ajaxdata');
      var $ajaxdataContents = $(data).find('#ajaxdata > *');
      console.log($ajaxdataContents);

      $body.animate( {scrollTop:0}, loadingDuration);
      $ajaxdataContainer.animate({ height : height + 'px'}, loadingDuration);

      $ajaxdata.animate({ opacity:0 }, loadingDuration, function(){
        $ajaxdata.html($ajaxdataContents);

        setTimeout(function(){
          $('#close-project-detail').on('click', closeProjectDetail); //To register event when loaded
          $ajaxdata.animate({ opacity:1 }, loadingDuration);
          height = $ajaxdata.innerHeight();
          height = height + "px";
          console.log(height);
          $ajaxdataContainer.animate({ height : height }, loadingDuration );
          history.pushState({},"", url);
        }, wait);
      });
    }

    $.ajax({
      url: url,
      data : {ajax : true},
      dataType : 'html'
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

      //To keep the height of main page for the background not to be lost.
      $sectionContainer.css({height:"100vh"});

      //To add a loading animation
      $mainContainer
      .append('<embed src="images/loadingGIF/spin.svg" type="image/svg+xml" style="position:absolute; top:45%; left: 50%; z-index: 9999;" />')
      
      //To hide the contents being rendered. 
      $sectionContainer
      .html(data)
      .children()
      .hide()

      setTimeout(function(){ 
          $projectlink = $('#work li a');
          $projectlink.on('click', openProjectDetail); //To register an event when page loaded by AJAX
          $sectionContainer.children().fadeIn(250);
          $('.main-container embed').remove();
          $sectionContainer.css({height:"auto"})
      }, 500)

      if(! $wrapperLR.hasClass('main-on')){

        //This prevents the home page from getting at the top at the moment of starting going to main page for mobile size.
        $wrapperLR.addClass('main-on keepstate-forth');

        // To add a button to close main page for mobile size.
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

  //Register events.
  $btnToSection.on('click', openSection);
  $btnToHome.on('click', backToHome);
  $projectlink.on('click', openProjectDetail);
  $('#close-project-detail').on('click', closeProjectDetail);

})();

