(function(){
  
  var $btnToSection = $(".btn-to-section"); //Nav links have this class.
  var $wrapperLR = $('.wrapper-l, .wrapper-r'); // The 2 classes wrap header, navigation, and main container.
  var $mainContainer = $('.main-container');
  var $sectionContainer = $('#section-container');
  var $section = $('section');
  var $btnToHome = $('.btn-to-home'); // Mobile close btn and home link have this class.
  var $closebtn = $('.closebtn'); // Mobile close btn.
  var $projectlink = $('#work li a'); // Need to add event to this twice (for Ajax and Pageload).

  // Duration of animation btween wrapperLR
  var animationDurationProperty = $wrapperLR.css('transition-duration');
  var animationDuration = 1000 * parseFloat(animationDurationProperty.replace('s',''));

  // The height of project detail window when loading contents.
  // (FIXME: When page is directly loaded, now it closes the window to 50px).
  var initialProjectDetailWindowHeight = 50;
  var ProjectDetailWindowHeight = initialProjectDetailWindowHeight;

  /*
  * Open the window to show the project detail on #work section.
  */
  var openProjectDetail = function(e){
    if(e) e.preventDefault();

    var loadingDuration = 720;
    var wait = 300; //To load innerHeight of #ajaxheight
    var url =  $(this).attr('href');
    var $body = $('body, html');
    var $ajaxdataContainer = $('.ajaxdata-container');
    console.log(url);

    var startProjectAnimation = function(data){
      var $ajaxdata = $('#ajaxdata');
      var $ajaxdataContents = $(data).find('#ajaxdata > *');
      $body.animate( {scrollTop:0}, loadingDuration);
      $ajaxdataContainer.animate({ height : ProjectDetailWindowHeight + 'px'}, loadingDuration);

      $ajaxdata.animate({ opacity:0 }, loadingDuration, function(){
        //To load html contents before showing
        $ajaxdata.html($ajaxdataContents);

        setTimeout(function(){
          //To register event when loaded
          $('#close-project-detail').on('click', closeProjectDetail); 
          $ajaxdata.animate({ opacity:1 }, loadingDuration);

          //To keep the height of previous window so that the window is not closed every time
          ProjectDetailWindowHeight = $ajaxdata.innerHeight();
          ProjectDetailWindowHeight = ProjectDetailWindowHeight + "px";
          console.log(ProjectDetailWindowHeight);

          //To animate to change the hight that the nexet project window has
          $ajaxdataContainer.animate({ height : ProjectDetailWindowHeight }, loadingDuration );

          //Only for click event
          if(e) history.pushState({},"", url);
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

  /*
  * Close the project detail window.
  */
  var closeProjectDetail = function(){
    $('.ajaxdata-container').animate({ height:0 }, 500);
    ProjectDetailWindowHeight = initialProjectDetailWindowHeight;
  }

  /*
  * Moving Animation to go to a section in main page.
  */
  var openSection = function(e){
    ProjectDetailWindowHeight = initialProjectDetailWindowHeight;
    var $dfd = $.Deferred();

    var complete = function(data){

      //To keep the height of main page for the background not to be lost.
      $sectionContainer.css({height:"100vh"});

      //To add a loading animation
      $mainContainer
      .append('<embed src="/images/loadingGIF/spin.svg" type="image/svg+xml" style="position:absolute; top:45%; left: 50%; z-index: 9999;" />')
      
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
          $sectionContainer.css({height:"auto"});

          $dfd.resolve();
      }, 500 )

      if( ! $wrapperLR.hasClass('main-on') ){

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
    }

    // To mark the only link selected
    var $selectedLink = $(this);
    var $unselectedLink =$btnToSection.not($selectedLink);
    $selectedLink.addClass('selected');
    $btnToHome.removeClass('selected');
    $unselectedLink.removeClass('selected');

    var url = $(this).attr('href');
    console.log(url);
    if(e) {
      e.preventDefault();
      history.pushState({},"", url);
    }

    $('.ajaxdata-container').css({ height : '0px' });
    $.ajax({
      url:url,
      data : {ajax : true},
      dataType: 'html'
    }).done(complete);

    return $dfd.promise();
  }

  /*
  * Moving Animation to go to home page.
  */
  var backToHome = function(e){

    // Does not happen when popstating.
    if(e){
      e.preventDefault();
      var url = $(this).attr('href');
      history.pushState({}, "", url);
    }

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

  /*
  * Load contents when 'back' or 'forward' button is pushed
  */
  var popstateFunc = function(e){

    var loadContents = function(){

      var urlPatternOfProject = new RegExp('work/.+');
      var urlPatternOfSection = new RegExp('/.+');
      var url = window.location.pathname;
      var tempDOM = $('<div href="'+ url +'" />');

      if (url.match(urlPatternOfProject)){
        console.log('project');
        var tempDOM2 = $btnToSection.filter('[href="/work"]');
        openSection.apply(tempDOM2).done(openProjectDetail.bind(tempDOM));
      }
      else{

        if (url.match(urlPatternOfSection)){
          console.log('section');
          var $tempDOM2 = $btnToSection.filter('[href="' + url + '"]');
          openSection.apply($tempDOM2);
        }
        else{
          console.log('home');
          backToHome();
        }
      }
    }

    if(e.originalEvent.state !== null){
      loadContents();
    }    
  }

  //Register events.
  $btnToSection.on('click', openSection);
  $btnToHome.on('click', backToHome);
  $projectlink.on('click', openProjectDetail);
  $('#close-project-detail').on('click', closeProjectDetail);
  $(window).on('popstate', popstateFunc);

  //Initial pushstate
  history.pushState({}, "", '/');

})();

