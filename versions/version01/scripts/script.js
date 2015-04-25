(function(){
  // Add this Later
  console.log($.pjax);
  $.pjax({
    link:'a#ajaxtest, a#ajaxtest2',
    area: '#pjax'
  });

  var $btnToSection = $(".btn-to-section"); //nav links have this class
  var $wrappers = $('.wrapper-l, .wrapper-r'); // that wrap header, navigation, and main container
  var $btnToHome = $('.btn-to-home'); // mobile close btn and home link have this class
  var $closebtn = $('.closebtn'); // mobile close btn and home link have this class

  var $animationDurationProperty = $wrappers.css('transition-duration');
  var $animationDuration = 1000 * parseFloat($animationDurationProperty.replace('s',''));

  /*
  * Moving Animation to go to a section in main page.
  */
  $btnToSection.on('click', function(){

    // To go to main page when being on header page by moving all containers
    $wrappers.addClass('main-on keepstate');
    $closebtn.addClass('main-on');

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
    
    //To go to the top of section
    $(window).scrollTop(0);

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
    $wrappers.removeClass('main-on');
    $closebtn.removeClass('main-on');
    $btnToHome.not($closebtn).addClass('selected');
    $btnToSection.removeClass('selected');

    setTimeout(function(){
      $('section').removeClass('active');
      $wrappers.removeClass('keepstate');
      $(window).scrollTop(0);
    }, $animationDuration);

  });

})();
