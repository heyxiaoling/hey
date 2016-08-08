/*工具方法*/
/*
*	所有特效在这里添加，修改（比如实现tab切换，轮播图之类）
*/
hey.util = (function(){
	
  var initModule,index_tab;
  index_tab = function($ele){
  	var _li=$ele.find('.tab_li li');
  	var _wap=$ele.find('.tab_content');
  	_li.on('click',function(){
  		var _index=$(this).index();
  		_li.removeClass('active');
  		_li.eq(_index).addClass('active');
    	_wap.css({'display':'none'});
    	_wap.eq(_index).css({'display':'block'});
    });
  };  
  

  initModule = function ($ele) {
   
  };
  return { 
		initModule : initModule,
		index_tab :index_tab 
	};

}())

