
/*所有页面的样式设置*/
hey.ele = (function () {
  var 
      configMap = {
        main_html : String()
        + '<div></div>',
      },
      stateMap={
        $page : null,
        $index : null,
        $login :null,
        $detail :null
      },
      jqueryMap = {},setStyle,initModule,firstHash;


    setJqueryMap = function(){//所有jquery变量缓存在这里
      var $page = stateMap.$page;
      var $index = stateMap.$index;
      var $login = stateMap.$login;
      var $detail = stateMap.$detail;
      jqueryMap={
        $page:$page,
        $index : $index,
        $login : $login,
        $detail : $detail
      };
    };
  
  setStyle = function(){
    var ww=$(window).width(),wh=$(window).height();
    jqueryMap.$page.css({'min-height':wh,"width":ww});
    firstHash = window.location.hash.substring(7) || 'index';
    $("#"+firstHash+"").css({'display':'block','z-index':99});
  };

  initModule = function () {
    stateMap.$page=$('.page');
    stateMap.$index=$('#index');
    stateMap.$login=$('#login');
    stateMap.$detail=$('#detail');
    setJqueryMap();
    setStyle();
    hey.page.page_login.pageCreate(jqueryMap.$login);
    hey.page.page_index.pageCreate(jqueryMap.$index);
    hey.util.index_tab(jqueryMap.$index);

  };
  return { 
    initModule : initModule,
    jqueryMap : jqueryMap
  };
}());

