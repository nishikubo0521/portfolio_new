(function(){
  
  var $body = $('body, html');
  var $btnToSection = $(".btn-to-section"); //Nav links have this class.
  var $wrapperLR = $('.wrapper-l, .wrapper-r'); // The 2 classes wrap header, navigation, and main container.
  var $mainContainer = $('.main-container');
  var $sectionContainer = $('#section-container');
  var $btnToHome = $('.btn-to-home'); // Mobile close btn and home link have this class.
  var $projectlink = $('.projectlink'); // Need to add event to this twice (for Ajax and Pageload).

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

    var loadingDuration = 720;
    var wait = 250; //To load innerHeight of #ajaxheight. This makes a feeling better than $.ready..
    var url =  $(this).attr('href'); console.log(url);
    var $ajaxdataContainer = $('.ajaxdata-container');
    var $ajaxdata = $('#ajaxdata');

    /*
    * AJAX success callback
    */
    var startProjectAnimation = function(data){

      var $ajaxdataContents = $(data).find('#ajaxdata > *'); //Reduce ajaxdata
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

        }, wait);

      });
    }

    if(e) {
      e.preventDefault();
      history.pushState({},"", url);
      $body.animate( {scrollTop: ($ajaxdataContainer.offset().top - 30) + 'px' }, loadingDuration);
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

    var $selectedLink = $(this);
    var $unselectedLink = $btnToSection.not($selectedLink);
    var $dfd = $.Deferred();
    var wait = 500; 
    var url = $(this).attr('href'); console.log(url);

    /*
    * AJAX Success callback
    */
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
      .hide();

      $sectionContainer.ready(function(){ 
          $projectlink = $('.projectlink');
          $projectlink.on('click', openProjectDetail); //To register an event when page loaded by AJAX
          $sectionContainer.children().fadeIn(500);
          $('.main-container embed').remove();
          $sectionContainer.css({height:"auto"});

          $dfd.resolve();
      });

      if( ! $body.hasClass('main-on') ){

        //This prevents the home page from getting at the top at the moment of starting going to main page for mobile size.
        $body.addClass('main-on keepstate-to-main');

        setTimeout(function(){
          $body.removeClass('keepstate-to-main');
          $(window).scrollTop(0);
        }, animationDuration);
      }
      else{
        $(window).scrollTop(0);
      }
    }

    ProjectDetailWindowHeight = initialProjectDetailWindowHeight;
    $selectedLink.addClass('selected');
    $btnToHome.removeClass('selected');
    $unselectedLink.removeClass('selected');

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

    if($body.hasClass('main-on')){
      $body.addClass('keepstate-to-home');
      $body.removeClass('main-on');

      setTimeout(function(){
        $body.removeClass('keepstate-to-home');
        $(window).scrollTop(0);
      }, animationDuration);
    }

    $btnToHome.not('.closebtn').addClass('selected');
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
  history.pushState({}, "", window.location.pathname);

})();

