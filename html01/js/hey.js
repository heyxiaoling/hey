var hey = (function () {
  var initModule = function ( $container ) {
    hey.ele.initModule();
    hey._hash.initModule();
  };
  return { initModule: initModule };
}());
