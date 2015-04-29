var hey = (function () {
  var initModule = function ( $container ) {
    hey.ele.initModule();
    hey.hash.initModule();
    hey.page.page_login.pageCreate($('#login'));
  };
  return { initModule: initModule };
}());
