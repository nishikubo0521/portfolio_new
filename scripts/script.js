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
  //var $animationDuration = 1000 * parseFloat($animationDurationProperty.replace('s',''));

  /*
  * Moving Animation to go to a section in main page.
  */
  $btnToSection.on('click', function(){

    // To go to main page when being on header page by moving all containers
    $wrappers.addClass('main-on keepwidth keepstate');
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

    //This will add the style to make wrapper static. -> scroll will be natural
    //$('.wrapper').addClass('main-on');
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
      $wrappers.removeClass('keepwidth keepstate');
    }, $animationDuration);

  });

})();
