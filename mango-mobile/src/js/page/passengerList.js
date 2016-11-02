/**
 * Created by xiaofengyu on 2016/10/22
 */

require('./../../skin/common/mgui.less');
require('./../../skin/page/passengerlist.less');
require('./../../skin/common/plugins/msg.less');

window.CONFIG = require('./../config.js');
window.mgui = require('./../lib/mgui/mgui.js');
window.mgui.template = require('./../lib/template.js');
require('./../lib/common.js');
require('./../lib/plugins/msg.js');

(function($) {
	 
	 //[[加载乘客列表数据
	 $.apiCaller.call({
        api: CONFIG.getApi('queryHisPsg'),
        showLoading: true, // 显示loading
        awaysRunFunc:true,
        dataType:'',
        data: {
            mkey:'f70a800bf60f59dbb8bbd7ee06548338'
        }
    }, function(res) {
    	if(res.retcode==0){
    		var html = $.template('passenger-list-template',res.data);
       	 	$('#passenger-list')[0].innerHTML = html;
    	}else{
    		$.jumpTo('http://mt.mangocity.com/views/user/login.html?type=0');
    	}
      
    });
    //]]加载乘客列表数据
    
    
	//[[事件绑定
	//编辑
	$('#passenger-list').on('click','i.icon-bianji',function(e){
		var passId=this.getAttribute('data');
		if(passId){
			var _parent=this.parentElement;
			var passenger={
				passId:passId,
				psgName:_parent.getElementsByClassName('J-psgName')[0].innerText || '',
				psgType:_parent.getElementsByClassName('J-psgType')[0].getAttribute('data') || '',
				certType:_parent.getElementsByClassName('J-certType')[0].getAttribute('data') || '',
				certId:_parent.getElementsByClassName('J-certId')[0].innerText || ''
			};
			$.cookieUtil.setItem({'key':'psg-'+passId,'value': JSON.stringify(passenger),'maxAge': 60*60*1000});
		}
		
		$.jumpTo('editPassenger.html',{
			passId:passId
		});
	});
	//添加
	$('#mg-passenger-add').on('click','li.mg-txt-center',function(e){
		$.jumpTo('editPassenger.html?');
	});
	//]]
	
	//选择确定
	var headerBtn=$('.mg-bar-nav')[0];
	var test = document.getElementById('header-btn');
	$('.mg-bar-nav').on('click','#header-menu',function(e){
		var num=$('input[name="psgCheck"]:checked').length;
		if(num){
			var psgList=new Array();
			$.each($('input[name="psgCheck"]:checked'), function(key,el) {
				psgList.push(el.value);
			}); 
			$.jumpTo('order.html?',{
				psgList:psgList
			});
		}else{
			$.msg({
	           type: 'alert',
	           text: '请勾选乘客信息!',
	           callback: function(){
	           }
	       	});
		}
		
	});
	
})(mgui);