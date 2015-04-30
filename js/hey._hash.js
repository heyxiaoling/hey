/*所有页面打开，隐藏，打开方式，隐藏方式，页面生成*/
hey._hash = (function () {
  var initModule,hashChange,
  configMap = {//所有静态配置放在这里
    _hash : [" "],
    num : 0,
  },
  movestyle={
    "index":{"moves":"left","click":false,"gohead":false,"goback":false},
    "login":{"moves":"left","click":false,"gohead":false,"goback":false},
    "detail":{"moves":"left","click":false,"gohead":false,"goback":false},
  },
  hashchangeway=true,//true表示浏览器前进后退
  movefn;
  hashChange = function(){
    var oA=$("a[data-hash]");
    var _hash;
    for(var i=0;i<oA.length;i++){
      oA.eq(i).on('click',function(){
        _hash=this.dataset.hash;
        if(window.location.hash==_hash){
          return false;
        }else{
          configMap._hash.push(_hash);
          configMap.num++;
          hashchangeway=false;
          movestyle[_hash]['moves']=$(this).attr('data-movestyle')||"left";
          window.location.hash = configMap._hash[configMap.num];
        }
      })
    }
    window.onhashchange = function(){
      console.log(history);
      var _hash=window.location.hash.substr(1);
      if(!hashchangeway){//点击或者其实形式hash变化
        switch(_hash){
          case "index":
            hey.page.page_index.pageIn($("#index"),movestyle.index.moves);
            hashchangeway=true;
            break;
          case "login":
            hey.page.page_login.pageIn($("#login"),movestyle.login.moves);
            hashchangeway=true;
            break;
          case "detail":
            hey.page.page_detail.pageIn($("#detail"),movestyle.detail.moves);
            hashchangeway=true;
            break;
          default :
            return false;
            break;
        }
      }else{//浏览器前进后退hash变化
        alert(configMap._hash[configMap.num-1]);
        if(_hash==configMap._hash[configMap.num-1]){
          alert(3333);
        }
        
      }
    };
  };
  movefn = function(){

  };
  initModule = function ( $obj ) {
    hashChange();
  };
  return { 
    initModule : initModule,
    movestyle : movestyle
   };
}());

