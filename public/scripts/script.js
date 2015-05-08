var PI = {

  onReady: function() {
    $.body = $('body, html');
    $.homelink = $('.homelink');
    $.sectionlink = $(".sectionlink");

    // Duration of animation btween wrapperLR
    var $wrapperLR = $('.wrapper-l, .wrapper-r');
    var animationDurationProperty = $wrapperLR.css('transition-duration');
    $.animationDuration = 1000 * parseFloat(animationDurationProperty.replace('s', ''));

    // The height of project detail window when loading contents.
    $.initialProjectDetailWindowHeight = 50;
    $.ProjectDetailWindowHeight = $.initialProjectDetailWindowHeight;

    //Event listners
    $.homelink.on('click', PI.backToHome);
    $.sectionlink.on('click', PI.goToSection);
    $(window).on('popstate', PI.popstateFunc);

    //Event listners for AJAX elements
    $.body.on('click', '.projectlink', PI.openProjectDetail);
    $.body.on('click', '#close-project-detail', PI.closeProjectDetail);

    history.pushState({}, "", window.location.pathname);
  },

  /*
   * Moving Animation to go to a section in main page
   */
  goToSection: function(e) {
    var $mainContainer = $('.main-container');
    var $sectionContainer = $('#section-container');
    var $selectedLink = $(this);
    var $unselectedLink = $.sectionlink.not($selectedLink);
    var $dfd = $.Deferred();
    var wait = 350;
    var url = $(this).attr('href');
    console.log(url);

    var beforeSend = function() {
      //To keep the height of main page for the background not to be lost.
      $sectionContainer.css({
        height: "100vh"
      });

      //To add a loading animation
      $mainContainer
        .append('<embed src="/images/loadingGIF/spin.svg" type="image/svg+xml" style="position:absolute; top:45%; left: 50%; z-index: 9999;" />');

      if (!$.body.hasClass('main-on')) {
        //This prevents the home page from getting at the top at the moment of starting going to main page for mobile size.
        $.body.addClass('main-on keepstate-to-main');

        setTimeout(function() {
          $.body.removeClass('keepstate-to-main');
          $(window).scrollTop(0);
        }, $.animationDuration);
      } else {
        $(window).scrollTop(0);
      }
    }

    /*
     * AJAX Success callback
     */
    var complete = function(data) {
      //To hide the contents being rendered. 
      $sectionContainer
        .html(data)
        .children()
        .hide();

      setTimeout(function() {
        $sectionContainer.children().fadeIn(500);
        $('.main-container embed').remove();
        $sectionContainer.css({
          height: "auto"
        });
        $dfd.resolve();
      }, wait);

    }

    $.ProjectDetailWindowHeight = $.initialProjectDetailWindowHeight;
    $.homelink.removeClass('selected');
    $selectedLink.addClass('selected');
    $unselectedLink.removeClass('selected');

    if (e) {
      e.preventDefault();
      history.pushState({}, "", url);
    }

    $('.ajaxdata-container').css({
      height: '0px'
    });
    $.ajax({
      url: url,
      data: {
        ajax: true
      },
      dataType: 'html',
      beforeSend: beforeSend
    }).done(complete);

    return $dfd.promise();
  },

  /*
   * Moving Animation to go to home page
   */
  backToHome: function(e) {
    // This does not happen when popstating
    if (e) {
      e.preventDefault();
      var url = $(this).attr('href');
      history.pushState({}, "", url);
    }

    if ($.body.hasClass('main-on')) {
      $.body.addClass('keepstate-to-home');
      $.body.removeClass('main-on');

      setTimeout(function() {
        $.body
          .scrollTop(0)
          .removeClass('keepstate-to-home');
      }, $.animationDuration);
    }

    $.homelink.not('.closebtn').addClass('selected');
    $.sectionlink.removeClass('selected');
  },

  /*
   * Open the window to show the project detail on #work section
   */
  openProjectDetail: function(e) {
    var heightChangeDuration = 720;
    var wait = 250; // To load innerHeight of #ajaxheight. This makes a feeling better than $.ready..
    var url = $(this).attr('href');
    console.log(url);
    var $ajaxdataContainer = $('.ajaxdata-container');
    var $ajaxdata = $('#ajaxdata');

    /*
     * AJAX success callback
     */
    var complete = function(data) {
      var $ajaxdataContents = $(data).find('#ajaxdata > *'); //Reduce ajaxdata
      $ajaxdataContainer.animate({
        height: $.ProjectDetailWindowHeight + 'px'
      }, heightChangeDuration);

      $ajaxdata.animate({
        opacity: 0
      }, heightChangeDuration, function() {

        //Loads html contents before showing
        $ajaxdata.html($ajaxdataContents);

        setTimeout(function() {
          $ajaxdata.animate({
            opacity: 1
          }, heightChangeDuration);

          //Keeps the height of previous window so that the window is not closed every time
          $.ProjectDetailWindowHeight = $ajaxdata.innerHeight();
          $.ProjectDetailWindowHeight = $.ProjectDetailWindowHeight + "px";
          console.log($.ProjectDetailWindowHeight);

          //Animates to change the hight that the nexet project window has
          $ajaxdataContainer.animate({
            height: $.ProjectDetailWindowHeight
          }, heightChangeDuration);

        }, wait);

      });
    }

    //This does not happen when popstating
    if (e) {
      e.preventDefault();
      history.pushState({}, "", url);
      $.body.animate({
        scrollTop: ($ajaxdataContainer.offset().top - 30) + 'px'
      }, heightChangeDuration);
    }

    $.ajax({
        url: url,
        data: {
          ajax: true
        },
        dataType: 'html'
      }).done(complete)
      .fail(function() {
        alert('error');
      });
  },

  /*
   * Close the project detail window
   */
  closeProjectDetail: function() {
    $('.ajaxdata-container').animate({
      height: 0
    }, 500);
    $.ProjectDetailWindowHeight = $.initialProjectDetailWindowHeight;
  },

  /*
   * Load contents when 'back' or 'forward' button is pushed
   */
  popstateFunc: function(e) {

    var loadContents = function() {
      var urlPatternOfProject = new RegExp('work/.+');
      var urlPatternOfSection = new RegExp('/.+');
      var url = window.location.pathname;
      var tempDOM = $('<div href="' + url + '" />');

      if (url.match(urlPatternOfProject)) {
        console.log('project');
        var tempDOM2 = $.sectionlink.filter('[href="/work"]');
        PI.goToSection.apply(tempDOM2).done(PI.openProjectDetail.bind(tempDOM));
      } else {
        if (url.match(urlPatternOfSection)) {
          console.log('section');
          var $tempDOM2 = $.sectionlink.filter('[href="' + url + '"]');
          PI.goToSection.apply($tempDOM2);
        } else {
          console.log('home');
          PI.backToHome();
        }
      }
    }

    if (e.originalEvent.state !== null) {
      loadContents();
    }
  }

}

$(document).ready(PI.onReady);