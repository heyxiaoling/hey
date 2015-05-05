/*所有页面打开，隐藏，打开方式，隐藏方式*/
hey.page = (function () {
  var initModule,page_index,page_login,page_detail;

  /*index page*/
  page_index = {
    pageCreate: function(obj){
      var main_html=String()
        + '<ul class="tab_li">'
          +'<li class="active">1</li>'
          +'<li>2</li>'
          +'<li>3</li>'
        +'</ul>'
        +'<div class="tab_content" style="display:block;">111</div>'
        +'<div class="tab_content">222</div>'
        +'<div class="tab_content">333</div>';
      obj.html(main_html);
    },
    pageIn: function(obj,mw){
      var ww=$(window).width(),wh=$(window).height();
      $('.page').css({'z-index':10});      
      if(mw=="left"){
        obj.css({"left":ww,"z-index":99,"display":'block'});
        obj.animate({left:0},200,function(){
          $('.page').css({'z-index':10,'display':'none'});
          $('div[data-hash='+obj.attr('id')+']').css({'display':'block'});
        });
      }else{
        obj.css({"left":-ww,"z-index":99,"display":'block'});
        obj.animate({left:0},200,function(){
          $('.page').css({'z-index':10,'display':'none'});
          $('div[data-hash='+obj.attr('id')+']').css({'display':'block'});
        });
      }
    },
    pageOut:function(){

    }
  };

  /*login page*/
  page_login = {
    pageCreate: function(obj){
      var main_html=String()
        + '<div class="login_form">'
          +'<ul>'
            +'<li><label>username</label><input type="text"></li>'
            +'<li><label>password</label><input type="password"></li>'
            +'<li><button class="res fr">reset</button><button class="sub fr mr10">submit</button></li>'
          +'</ul>'
        +'</div>';
      obj.html(main_html);
    },
    pageIn: function(obj,mw){
      var ww=$(window).width(),wh=$(window).height();
      $('.page').css({'z-index':10});
      if(mw=="left"){
        obj.css({"left":ww,"z-index":99,"display":'block'});
        obj.animate({left:0},200,function(){
          $('.page').css({'z-index':10,'display':'none'});
          $('div[data-hash='+obj.attr('id')+']').css({'display':'block'});
        });
      }else{
        obj.css({"left":-ww,"z-index":99,"display":'block'});
        obj.animate({left:0},200,function(){
          $('.page').css({'z-index':10,'display':'none'});
          $('div[data-hash='+obj.attr('id')+']').css({'display':'block'});
        });
      }
    },
    pageOut:function(){

    }
  };
  /*detail page*/ 
  page_detail = {
    pageIn: function(obj,mw){
      var ww=$(window).width(),wh=$(window).height();
      $('.page').css({'z-index':10});
      if(mw=="left"){
        obj.css({"left":ww,"z-index":99,"display":'block'});
        obj.animate({left:0},200,function(){
          $('.page').css({'z-index':10,'display':'none'});
          $('div[data-hash='+obj.attr('id')+']').css({'display':'block'});
        });
      }else{
        obj.css({"left":-ww,"z-index":99,"display":'block'});
        obj.animate({left:0},200,function(){
          $('.page').css({'z-index':10,'display':'none'});
          $('div[data-hash='+obj.attr('id')+']').css({'display':'block'});
        });
      }
    },
    pageOut:function(){

    }
  };

  initModule = function (){
    
  };
  return { 
    initModule : initModule,
    page_index : page_index,
    page_login : page_login,
    page_detail :page_detail
   };
}());

