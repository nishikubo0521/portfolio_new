(function(){
  // Add this Later
  
  console.log($.pjax);
  $.pjax({
    link:'a#ajaxtest',
    area: '#pjax'
  });
  

  //Test Btn
  $('#btn').on('click', function(){
    $('.container').toggleClass('main-on');
  });

  var $btnToSection = $(".btn-to-section"); //nav links have this class
  var $container = $('.container'); // that wrap header, navigation, and main container
  var $btnToHome = $('.btn-to-home'); // mobile cross btn and home link have this class
  
  /*
  * Moving Animation to go to a section in main page.
  * Will Probably be fixed later by wrapping header and navigation containers.
  */
  $btnToSection.on('click', function(){

    // To go to main page when being on header page by moving all containers
    $container.addClass('main-on');

    // To show the page clicked
    var $sectionId = $(this).data("sectionId");
    var $selectedSection = $($sectionId);
    $selectedSection.addClass("active");

    // To hide the pages not clicked
    var $unselectedSections = $('section:not(' + $sectionId + ')');
    $unselectedSections.removeClass('active');

  });

  /*
  * Moving Animation to go to home page.
  * Will Probably be fixed later by wrapping header and navigation containers.
  */
  $btnToHome.on('click', function(){
    $container.removeClass('main-on');
  });

})();
