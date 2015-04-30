
/*所有页面的样式*/
hey.ele = (function () {
  var setStyle,initModule,firstHash,
  stateMap={$page : null},
  jqueryMap = {},
  setJqueryMap = function(){//所有jquery变量缓存在这里
    var $page = stateMap.$page;
    jqueryMap={$page:$page};
  };
  
  setStyle = function(){
    var ww=$(window).width(),wh=$(window).height();
    jqueryMap.$page.css({'min-height':wh,"width":ww});
    firstHash = window.location.hash.substring(1) || 'index';
    $("#"+firstHash+"").css({'display':'block','z-index':99});
  };

  initModule = function () {
    stateMap.$page=$('body').find('.page');
    setJqueryMap();
    setStyle();
  };
  return { initModule : initModule };
}());

