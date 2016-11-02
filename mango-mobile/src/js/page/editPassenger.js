 /**
 * Created by xiaofengyu on 2016/10/22
 */

require('./../../skin/common/mgui.less');
require('./../../skin/page/editpassenger.less');
require('./../../skin/common/plugins/popup.less');      // 弹窗控件
require('./../../skin/common/plugins/condition.less');
require('./../../skin/common/plugins/popup-style.less');

window.CONFIG = require('./../config.js');
window.mgui = require('./../lib/mgui/mgui.js');
window.mgui.template = require('./../lib/template.js');
require('./../lib/common.js');
require('./../lib/plugins/popup.js');                   // 弹窗控件

require('./../lib/plugins/condition.js');

(function($) {
	
	//[[初始化弹出层对象
	var popDom = $("#mg-passenger-tips").popup({
        mask:true,               
        autoHide:true            
    });
	//初始化弹出层对象]]
	
	//[[初始化数据
	$.onRecvData = function(inData) {
		console.log('Recv:'+JSON.stringify(inData));
		var data={
			passId:''
		};
		data=$.extend(data, inData);
		if(data.passId){
			var _data=$.cookieUtil.getItem('psg-'+data.passId);
		 	_data=eval('('+_data+')');
			$("#mg-edit-passenger").setForm({
				passId:_data.passId || '',
		        psgName: _data.psgName || '',
		        certId: _data.certId || ''
		    });
		   
		    renderOpt({
		    	_thisVal:_data.psgType ,
				_el:$('.J-passenger-type')[1],
				_sel:$('#psgType')[0]
		    });
		    
		    renderOpt({
		    	_thisVal:_data.certType ,
				_el:$('.J-document-type')[1],
				_sel:$('#certType')[0]
		    });
		}
		
		var formData = $("#mg-edit-passenger").serialize();  
	    var queryString = $.objToQuery(formData);  
	    $("#mg-edit-passenger").setForm(CONFIG.getApi('addHisPsg')+"?" + queryString); 
	};
	//初始化数据]]
	
	//[[事件绑定
	//保存
	$('.mg-bar-nav').on('click','#header-menu',function(e){
		debugger;
		var _passId=$('#passId')[0].value;
		if(_passId){
			$.cookieUtil.setItem({'key':'psg-'+_passId,'value': '','maxAge': 0});
		}
		var queryStr = $.objToQuery($("#mg-edit-passenger").serialize());
		$("#mg-edit-passenger")[0].submit();
	  	$.jumpTo('passengerList.html?');

	});
	
	//证件类型
	 $('#mg-edit-passenger').on('click','.J-document-type',function(){
        $.condition('#mg-document-type',{
            onSlideClick:function(el){
                var _passengeType=el.getAttribute('data');
                var _thisTxt= el.innerText;
              	renderOpt({
              		_thisVal:_passengeType,
					_el: $('.J-document-type')[1],
					_sel:$('#certType')[0]
              	});
            }
        });    
    });
    
	//旅客类型
	$('#mg-edit-passenger').on('click','.J-passenger-type',function(){
        $.condition('#mg-passenger-type',{
            onSlideClick:function(el){
                var _passengeType=el.getAttribute('data');
                var _thisTxt= el.innerText;
              	renderOpt({
              		_thisVal:_passengeType,
					_el:$('.J-passenger-type')[1],
					_sel:$('#psgType')[0]
              	});
            }
        });    
    });
    
	//弹出层
	$('#mg-edit-passenger').on('click','i.icon-yiwen',function(e){
		popDom.show();
	});
	//弹出层收起
	$('#mg-passenger-tips').on('click', 'span.dialog-btn', function(e) {
		popDom.hide();
    });
	//]]
	
	//[[重置select的option
	var renderOpt=function(opt){
		var _opt={
			_thisVal:'',
			_el:null,
			_sel:null
		};
		_opt=$.extend(_opt, opt);
		var _thisTxt='';
		var opts=_opt._sel.options; 
		$.each(opts, function(i,el) {
			if(el.value==_opt._thisVal){
				el.selected=true;
				_thisTxt=el.innerText;
			}
		});
		_opt._el.innerText=_thisTxt;
	};
	
	//事件绑定]]
})(mgui);