/*所有页面打开，隐藏，打开方式，隐藏方式，页面生成*/
hey._hash = (function () {
  var 
    configMap = {//所有静态配置放在这里

    },
    stateMap  = {
      $container  : null,
      anchor_schema_map  : {
        page : 'null'
      },
      what_page     : 'index'
    },
    initModule,onHashchange,copyAnchorMap,changeAnchorPart,pageChange;


  copyAnchorMap = function () {
    return $.extend( true, {}, stateMap.anchor_map );
  };

  changeAnchorPart = function ( arg_map ) {
    var
      anchor_map_revise = copyAnchorMap(),
      bool_return       = true,
      key_name, key_name_dep;

    KEYVAL:
    for ( key_name in arg_map ) {
      if ( arg_map.hasOwnProperty( key_name ) ) {

        if ( key_name.indexOf( '_' ) === 0 ) { continue KEYVAL; }

        anchor_map_revise[key_name] = arg_map[key_name];

        key_name_dep = '_' + key_name;
        if ( arg_map[key_name_dep] ) {
          anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
        }
        else {
          delete anchor_map_revise[key_name_dep];
          delete anchor_map_revise['_s' + key_name_dep];
        }
      }
    }
    try {
      $.uriAnchor.setAnchor( anchor_map_revise );
    } catch ( error ) {
      $.uriAnchor.setAnchor( stateMap.anchor_map,null,true );
      bool_return = false;
    }

    return bool_return;
  };
  onHashchange = function(event){
    var
      anchor_map_previous = copyAnchorMap(),
      anchor_map_proposed,
      _s_page_previous, _s_page_proposed,
      s_page_proposed;

    try { 
      anchor_map_proposed = $.uriAnchor.makeAnchorMap(); 
    }catch ( error ) {
      $.uriAnchor.setAnchor( anchor_map_previous, null, true );
      return false;
    }
    stateMap.anchor_map = anchor_map_proposed;
    _s_page_previous = anchor_map_previous._s_page;
    _s_page_proposed = anchor_map_proposed._s_page;
    if(_s_page_proposed||_s_page_proposed!==_s_page_previous){
      s_page_proposed = anchor_map_proposed.page?anchor_map_proposed.page:stateMap.what_page;
      switch ( s_page_proposed ) {
        case 'index' :
          console.log('index');
          hey.page.page_index.pageIn($('#index'));
        break;
        case 'login':
          console.log('login');
          hey.page.page_login.pageIn($('#login'));
        break;
        case 'detail' :
          console.log('detail');
          hey.page.page_detail.pageIn($('#detail'));
        break;
        default :
          console.log('four');
          delete anchor_map_proposed.page;
          $.uriAnchor.setAnchor( anchor_map_proposed, null, true );
      }
        return false; 
    }else{
      console.log('first page');
    }
  };
    
  pageChange = function(_hash){
    changeAnchorPart({
      page : _hash
    });
    return false;
  };
  initModule = function( $obj ){
    var oA=$("a[data-hash]");
    var _hash;
    for(var i=0;i<oA.length;i++){
      oA.eq(i).on('click',function(){
        _hash=this.dataset.hash;
        pageChange(_hash);
      });
    }

    $.uriAnchor.configModule({
      schema_map : configMap.anchor_schema_map
    });

    $(window).bind( 'hashchange', onHashchange ).trigger( 'hashchange' );
  };
  return { 
    initModule : initModule
   };
}());

