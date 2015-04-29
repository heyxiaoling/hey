/*所有页面打开，隐藏，打开方式，隐藏方式*/
hey.page = (function () {
  var initModule,page_index,page_login,page_detail,oHash=["index"],num=0;
  var ww=$(window).width(),wh=$(window).height();
  page_index = {
    pageIn: function(obj){
      $('.page').css({'z-index':10});      
      if(obj.attr('data-movestyle')=="left"){
        obj.css({"left":ww,"z-index":99,"display":'block'});
        obj.animate({left:0},200,function(){
          $('.page').css({'z-index':10,'display':'none'});
          $('div[data-hash='+obj.attr('id')+']').css({'display':'block'});
          $(this).attr('data-movestyle','right');
        });
      }else{
        obj.css({"left":-ww,"z-index":99,"display":'block'});
        obj.animate({left:0},200,function(){
          $('.page').css({'z-index':10,'display':'none'});
          $('div[data-hash='+obj.attr('id')+']').css({'display':'block'});
          $(this).attr('data-movestyle','left');
        });
      }
    },
    pageOut:function(){

    }
  };
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
    pageIn: function(obj){
      $('.page').css({'z-index':10});
      if(obj.attr('data-movestyle')=="left"){
        obj.css({"left":ww,"z-index":99,"display":'block'});
        obj.animate({left:0},200,function(){
          $('.page').css({'z-index':10,'display':'none'});
          $('div[data-hash='+obj.attr('id')+']').css({'display':'block'});
          $(this).attr('data-movestyle','right');
        });
      }else if(obj.attr('data-movestyle')=="right"){
        obj.css({"left":-ww,"z-index":99,"display":'block'});
        obj.animate({left:0},200,function(){
          $('.page').css({'z-index':10,'display':'none'});
          $('div[data-hash='+obj.attr('id')+']').css({'display':'block'});
          $(this).attr('data-movestyle','left');
        });
      }
    },
    pageOut:function(){

    }
  }; 
  page_detail = {
    pageIn: function(obj){
      $('.page').css({'z-index':10});
      if(obj.attr('data-movestyle')=="left"){
        obj.css({"left":ww,"z-index":99,"display":'block'});
        obj.animate({left:0},200,function(){
          $('.page').css({'z-index':10,'display':'none'});
          $('div[data-hash='+obj.attr('id')+']').css({'display':'block'});
          $(this).attr('data-movestyle','right');
        });
      }else{
        obj.css({"left":-ww,"z-index":99,"display":'block'});
        obj.animate({left:0},200,function(){
          $('.page').css({'z-index':10,'display':'none'});
          $('div[data-hash='+obj.attr('id')+']').css({'display':'block'});
          $(this).attr('data-movestyle','left');
        });
      }
    },
    pageOut:function(){

    }
  };

  initModule = function ( $obj ) {
    
  };
  return { 
    initModule : initModule,
    page_index : page_index,
    page_login : page_login,
    page_detail :page_detail
   };
}());

