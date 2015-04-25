(function(){
  // Add this Later
  /*
  console.log($.pjax);
  $.pjax({
    link:'a#ajaxtest, a#ajaxtest2',
    area: '#pjax'
  });
  */

  //
  var $btnToSection = $(".btn-to-section"); //nav links have this class
  var $wrapperLR = $('.wrapper-l, .wrapper-r'); // that wrap header, navigation, and main container
  var $section = $('section');
  var $btnToHome = $('.btn-to-home'); // mobile close btn and home link have this class
  var $closebtn = $('.closebtn'); // mobile close btn and home link have this class

  // Duration of animation btween wrapperLR
  var $animationDurationProperty = $wrapperLR.css('transition-duration');
  var $animationDuration = 1000 * parseFloat($animationDurationProperty.replace('s',''));

  /*
  * Moving Animation to go to a section in main page.
  */
  $btnToSection.on('click', function(){

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

    // To show the page clicked
    var $sectionId = $(this).data("sectionId");
    var $selectedSection = $($sectionId);
    $selectedSection.addClass("active");

    // To hide the pages not clicked
    var $unselectedSections = $('section:not(' + $sectionId + ')');
    $unselectedSections.removeClass('active');

    /* Ver 2 
    var $sectionId = $(this).data("sectionId");
    var $selectedSection = $($sectionId);
    var $unselectedSections = $('section:not(' + $sectionId + ')');
    $unselectedSections .fadeOut(250)
                        .promise()
                        .done(function(){
                          $unselectedSections.removeClass('active');
                          $selectedSection.fadeIn(250)
                                          .promise()
                                          .done(function(){
                                            $selectedSection.addClass('active');
                                          });
                        });
    */
  });

  /*
  * Moving Animation to go to home page.
  */
  $btnToHome.on('click', function(){

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
  });

})();
