/**
 * Created by xiaofengyu on 2016/10/17
 */

require('./../../skin/common/mgui.less');
require('./../../skin/page/flightdetail.less');
require('./../../skin/common/plugins/popup.less');// 弹窗控件 
require('./../../skin/common/plugins/popup-style.less');//弹出层样式
require('./../../skin/common/airlinemap.less');//航司图片

window.CONFIG = require('./../config.js');
window.mgui = require('./../lib/mgui/mgui.js');
window.mgui.template = require('./../lib/template.js');
require('./../lib/common.js');
require('./../lib/plugins/popup.js');                   // 弹窗控件

(function($) {

	/***
	 * 
	 * @param {Object} inData={ 
	 * agencyCode :'WEB',
	 * departCity :'SHA',
	 * arrivalCity :'PEK',
	 * depDate :'2016-11-05',
	 * routeType :'OW',//行程类型,OW单程,RT往返
	 * flightNo :'CZ3952',
	 * apiSource:'h5',
	 * departCityName:'',//起飞城市
	 * arrivalCityName:'',//降落城市
	 * routeDirect:'' //行程方向,routeType为RT时存在 routeDirect 取值范围 【1 去程,2 回程】
	 * cabinLevel:''//舱位等级 [1 经济舱,2 商务舱,4 头等舱],
	 * 
	 * }
	 */
	 $.onRecvData = function(inData) {
		console.log('Recv:'+JSON.stringify(inData));
		var data = {
			agencyCode :'WEB',
			departCity :'SHA',
			arrivalCity :'PEK',
			depDate :'2016-11-05',
			routeType :'OW', 
			flightNo :'MU5696',
			departCityName:'',
			arrivalCityName:'',
			routeDirect:'' ,
			cabinLevel:'',
			
		}; 
		
		data=$.extend(data,inData);
		var _data = {
			agencyCode :data.agencyCode?data.agencyCode:'WEB',
			departCity :data.departCity?data.departCity:'SHA',
			arrivalCity :data.arrivalCity?data.arrivalCity:'PEK',
			depDate :data.depDate?data.depDate:'2016-11-05',
			routeType :data.routeType?data.routeType:'OW',
			flightNo :data.flightNo?data.flightNo:'CZ3952'
		};
		
		$.apiCaller.call({
			api: CONFIG.getApi('queryAllFlights'),
			showLoading: true,
			data: _data
		}, function(res) {
		 
			$.template.helper('getWeekDayBy',function(opt){
				var weekday=new Array(7);
				weekday[0]='周日';
				weekday[1]='周一';
				weekday[2]='周二';
				weekday[3]='周三';
				weekday[4]='周四';
				weekday[5]='周五';
				weekday[6]='周六';
				return weekday[$.DateTimeUtil.getWeekday(opt)];
			 });
			
			$.template.helper('getFlightTime',function(sDate,eDate){
				var _opt={sDate:sDate,eDate:eDate};
				var diff=$.DateTimeUtil.getDeltaT(_opt);
				return diff;
			});
			
			//机场名称格式化
			var depStr=res.data.depAirPortCn;
			var arrivalStr=res.data.arrAirPortCn;
			res.data.depAirPortCn=depStr.replace(inData.departCityName,'');
			res.data.arrAirPortCn=arrivalStr.replace(data.arrivalCityName,'');
			
			res.data.routeType=_data.routeType;
			res.data.routeDirect=_data.routeDirect;
			
//			res.data.routeType="RT";
//			res.data.routeDirect=1;

			var htmlData={
				flight:res.data,
				transfer:''
			};
			//[[经停信息
        	if(res.data.stop){
        		$.apiCaller.call({
					api: CONFIG.getApi('queryFlightStopInfo'),
					showLoading: true,
					data: {
        				planeDate:res.data.depDate,
        				flightNo:res.data.flightNo
        			}
				}, function(_res) {
					 htmlData.transfer=_res.data; 
					 var detailHtml=$.template('flight-detail-template',htmlData);
					 $('#mg-flight-detail')[0].innerHTML = detailHtml;
				});
        	}
        	//经停信息]]
        	if(!res.data.stop){
        		var detailHtml=$.template('flight-detail-template',htmlData);
				$('#mg-flight-detail')[0].innerHTML = detailHtml;
        	}
			
			res.data.cabinLevel=data.cabinLevel;
			var seatHtml = $.template('seat-list-template',res.data);
        	$('#seat-list')[0].innerHTML = seatHtml;
        	
        	if(data.departCityName && data.arrivalCityName){
        		$.setTitle(data.departCityName+'<i class="iconfont icon-toarrow"></i>'+data.arrivalCityName);
        	}
        	
        	//$.cookieUtil.setItem({'key':'detail-','value': location,'maxAge': 30*24*60*60*1000});
			
		});
		
	
	
	};
	
	
	//[[初始化弹出层对象
	var popDom = $("#mg-debook").popup({
        mask:true,               
        autoHide:true         
    });
	//]]
	
	//[[预订按钮
	$('#seat-list').on('click','button.btn-with-active',function(e){
    	$.jumpTo('order.html?');
    });
	//]]
	
	//[[ 退订规则
	$('#seat-list').on('click', 'a.J-mg-refund', function(e) {
		popDom.show();  
		var data={
			fareItemId:'',
			provisionType:'',
			airways:'',
			classNO:'',
			beginDate:'',
			depCity:'',
			arrCity:''
		};
		
		$.apiCaller.call({
			api: CONFIG.getApi('queryProvisionInfo'),
			showLoading: true,
			data: _data
		}, function(res) {
			if(res && res.data){
				//TODO 渲染数据
			}
		});
		
    });
    
    $('#mg-debook').on('click','span.dialog-btn',function(e){
    	popDom.hide();
    	$.jumpTo('order.html?',{
    		tripType:"",	// 行程类型 f
            policyId:"",	// 政策ID s
            policyType:"",	// 政策类型 s
            fareItemId:"",	// 运价条目ID unknow
            airways:"",	    // 航空公司 f airlineCn
            classNO:"",	// 舱位    //cabinLevel
            depDate:"",	// 出发日期  depDate 
            depTime:"",	// 出发时间 arrDate
            depCity:"",	// 出发地
            arrCity:"",	// 目的地  
            price:"",	// 价格 s
            supplier:"",	// 供应商 需要传递
            discount:"",	// 折扣 discountId
            param1:""	// 保留字段
    	});
    });
    
	//]]

	
	 
})(mgui);