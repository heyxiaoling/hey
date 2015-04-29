/*所有页面打开，隐藏，打开方式，隐藏方式，页面生成*/
hey.hash = (function () {
  var initModule,hashChange,oHash=["index"],num=0;
  var ww=$(window).width(),wh=$(window).height();
  hashChange = function(){
    var oA=$("a[data-hash]");
    var _hash;
    for(var i=0;i<oA.length;i++){
      oA.eq(i).on('click',function(){
        _hash=this.dataset.hash;
        if(window.location.hash==_hash){
          return false;
        }else{
          oHash.push(_hash);
          num++;
          window.location.hash = oHash[num];
        }
      })
    }
    window.onhashchange = function(){
      console.log(history);
      if(oHash[0]=="index"&&oHash.length==1){
        alert(4);
      }else{
        switch(window.location.hash.substr(1)){
          case "index":
            hey.page.page_index.pageIn($("#index"));
            break;
          case "login":
            hey.page.page_login.pageIn($("#login"));
            break;
          case "detail":
            hey.page.page_detail.pageIn($("#detail"));
            break;
          default :
            return false;
            break;
        }
      }
    };
  };

  initModule = function ( $obj ) {
    hashChange();
  };
  return { initModule : initModule };
}());

