(function(){
  
  var $btnToSection = $(".btn-to-section"); //nav links have this class
  var $wrapperLR = $('.wrapper-l, .wrapper-r'); // that wrap header, navigation, and main container
  var $section = $('section');
  var $btnToHome = $('.btn-to-home'); // mobile close btn and home link have this class
  var $closebtn = $('.closebtn'); // mobile close btn and home link have this class
  var $projectlink = $('#work a'); // need to add event to this twice (for Ajax and Pageload)

  // Duration of animation btween wrapperLR
  var $animationDurationProperty = $wrapperLR.css('transition-duration');
  var $animationDuration = 1000 * parseFloat($animationDurationProperty.replace('s',''));

  /*
  * Open the window to show the project detail on #work section
  */
  var openProjectDetail = function(e){

    e.preventDefault();
    console.log($projectlink);

    var height = 0;
    var px = "";
    var loadingDuration = 900;
    var url =  $(this).attr('href');
    console.log(url);

    var startAnimation = function(){
      $('html, body').animate( {scrollTop:0}, loadingDuration);
      $('.ajaxdata-container').animate({ height : '50px'}, loadingDuration);
      $('#ajaxdata').animate({ opacity:0 }, loadingDuration);
    }

    var complete = function(data){
      var part = $(data).find('.ajaxdata-container');
      //console.log(part.html());

      setTimeout(function(){

        $('.ajaxdata-container').html(part);
        height = $('#ajaxdata').innerHeight();
        px = height + "px";
        console.log(px);

        $('.ajaxdata-container').animate({ height : px }, loadingDuration);
        $('#ajaxdata').animate({ opacity:1 }, loadingDuration);
        history.pushState({},"", url);
      }, loadingDuration);

    }

    $.ajax({
      url: url,
      data : {ajax : true},
      dataType : 'html'
      //beforeSend : startAnimation
    })
    .done(startAnimation)
    .fail(function(){alert('error');})
    .always(complete);
  }

  /*
  * Moving Animation to go to a section in main page.
  */
  var openSection = function(e){

    var complete = function(data){

      $('#section-container').html(data);
      $projectlink = $('#work a');
      $projectlink.on('click', openProjectDetail);

      //This prevents the page from being at the top when going to main
      if(! $wrapperLR.hasClass('main-on')){
        $wrapperLR.addClass('main-on keepstate-forth');
        $closebtn.addClass('main-on');
        setTimeout(function(){
          $wrapperLR.removeClass('keepstate-forth');
          $(window).scrollTop(0);
        }, $animationDuration);
      }
      else{
          $(window).scrollTop(0);
      }

      // To mark the only link selected
      var $selectedLink = $(this);
      var $unselectedLink =$btnToSection.not($selectedLink);
      $selectedLink.addClass('selected');
      $btnToHome.removeClass('selected');
      $unselectedLink.removeClass('selected');

      history.pushState({},"", url);
    }

    e.preventDefault();
    var url = $(this).attr('href');
    console.log(url);
    //$('#section-container').load(url, {ajax : true} ,function(){console.log('hey')} );
    $.ajax({
      url:url,
      data : {ajax : true},
      dataType: 'html'
    }).done(complete.bind(this));
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
      }, $animationDuration);
    }

    $btnToHome.not($closebtn).addClass('selected');
    $btnToSection.removeClass('selected');
  }

  $btnToSection.on('click', openSection);

  $btnToHome.on('click', backToHome);

  $projectlink.on('click', openProjectDetail);

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
