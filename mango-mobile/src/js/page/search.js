/**
 * Created by zhuyu on 2016/10/9.
 */
// 样式引入
require('./../../skin/common/mgui.less');
require('./../../skin/page/search.less');
require('./../../skin/common/plugins/popup.less');      // 弹窗控件
require('./../../skin/common/plugins/condition.less');      

// js引入
window.CONFIG = require('./../config.js');      // 配置文件，含：api接口信息，项目信�
window.mgui = require('./../lib/mgui/mgui.js'); // mgui主框
require('./../lib/common.js');
require('./../../skin/common/plugins/msg.less');
require('./../lib/plugins/msg.js');
require('./../lib/tab.js');
require('./../lib/location.js');
require('./../lib/plugins/popup.js');   
require('./../lib/plugins/condition.js');   

module.exports = (function($) {
    var doc = document,
        wrap = $('.mg-content');


    var paramsObj = {};
    var ow = doc.querySelectorAll('.mg-search-ow')[0];
    var rt = doc.querySelectorAll('.mg-search-rt')[0];
    //单程出发城市,返回城市
    var depCityOW = ow.querySelectorAll('.search-addr-go span')[0];
    var arrCityOW = ow.querySelectorAll('.search-addr-back span')[0];
    //双程出发城市,返回城市
    var depCityRT = rt.querySelectorAll('.search-addr-go span')[0];
    var arrCityRT = rt.querySelectorAll('.search-addr-back span')[0];

    //单程出发时间
    var startDateOW = ow.querySelectorAll('.search-date-go span')[0];
        


    //双程出发时间，返回时�
    var startDateRT = rt.querySelectorAll('.search-date-go span')[0];
    var endDateRT = rt.querySelectorAll('.search-date-back')[0];

    //默认参数
    paramsObj.tripType = 'OW';   //OW单程，RT往返程  //默认单程
    paramsObj.startDateOW = getDayInfo('',1)[0];  //单程出发时间
    paramsObj.startDateRT = getDayInfo('',1)[0];  //双程出发时间
    paramsObj.endDateRT = getDayInfo('',2)[0];    //双程返回时间

    paramsObj.position = '';    //仓位
    paramsObj.depCityIdOW = 'SZX'; // 单程出发城市三字� //默认深圳
    paramsObj.depCityIdRT = 'SZX'; // 双程出发城市三字� //默认深圳
    paramsObj.arrCityIdOW = 'SHA'; // 单程到达城市三字�//默认上海
    paramsObj.arrCityIdRT = 'SHA'; // 双程到达城市三字�//默认上海

    paramsObj.depCityCityNameOW = '深圳'; // 单程出发城市名称  //默认深圳
    paramsObj.depCityCityNameRT = '深圳'; // 双程出发城市名称  //默认深圳

    paramsObj.arrCityCityNameOW = '上海'; // 单程到达城市名称
    paramsObj.arrCityCityNameRT = '上海'; // 双程到达城市名称

    paramsObj.city = 'dep'; // dep 出发城市 arr 到达城市 //默认出发城市
    paramsObj.time = 'start'; //  start出发时间 end到达时间 //默认出发时间
    paramsObj.tabCount = 0; // 默认显示的tab
    
    //默认城市设置
    depCityOW.innerHTML = paramsObj.depCityCityNameOW;
    arrCityOW.innerHTML = paramsObj.depCityCityNameOW;

    depCityRT.innerHTML = paramsObj.depCityCityNameRT;
    arrCityRT.innerHTML = paramsObj.arrCityCityNameRT;


    //默认时间设置
    startDateOW.innerHTML = getDayInfo(paramsObj.startDateOW,0)[1].slice(-6) + '<em>' + getDayInfo(paramsObj.startDateOW,0)[2] +'</em>';
    startDateRT.innerHTML = getDayInfo(paramsObj.startDateRT,0)[1].slice(-6) + '<em>' + getDayInfo(paramsObj.startDateRT,0)[2] +'</em>';
    endDateRT.innerHTML = '<label>返程日期</label><span>' + getDayInfo(paramsObj.endDateRT,0)[1].slice(-6) + '<em>' + getDayInfo(paramsObj.endDateRT,0)[2] + '</em></span>';



    $.onRecvData = function(data){
        
        $.extend(true,paramsObj,data);
        initPage();
    };

    function initPage(){
        //初始化页�
        paramsObj.tabCount = (paramsObj.tripType === 'OW') ? 0 : 1; // 默认显示的tab


        
        

        if(paramsObj.tripType === 'OW'){
            depCityOW.innerHTML = paramsObj.depCityCityNameOW;
            arrCityOW.innerHTML = paramsObj.arrCityCityNameOW;

            startDateOW.innerHTML = getDayInfo(paramsObj.startDateOW,0)[1].slice(-6) + '<em>' + getDayInfo(paramsObj.startDateOW,0)[2] +'</em>';

        }else{
            depCityRT.innerHTML = paramsObj.depCityCityNameRT;
            arrCityRT.innerHTML = paramsObj.arrCityCityNameRT;

            startDateRT.innerHTML = getDayInfo(paramsObj.startDateRT,0)[1].slice(-6) + '<em>' + getDayInfo(paramsObj.startDateRT,0)[2] +'</em>';
            endDateRT.innerHTML = '<label>返程日期</label><span>' + getDayInfo(paramsObj.endDateRT,0)[1].slice(-6) + '<em>' + getDayInfo(paramsObj.endDateRT,0)[2] + '</em></span>';

        }
       
        //tab
        $.tab('#mg-search-tab',{
            initialSlide: paramsObj.tabCount,
            onTitleChange: function(i){
                paramsObj.tripType = (i===0) ? 'OW' : 'RT';  //单程，往返程判断
            }
        });
        
    }
    
    //单程出发城市
    $(ow).on('click','.search-addr-go',function(){ 
        paramsObj.city = 'dep';  //出发城市
        $.jumpTo('searchCity.html',paramsObj);
    });

    //单程返回城市
    $(ow).on('touchstart','.search-addr-back',function(){ 
        paramsObj.city = 'arr';  //返回城市

        console.log(paramsObj);
        debugger;
        $.jumpTo('searchCity.html',paramsObj);
    });

    //双程出发城市
    $(rt).on('click','.search-addr-go',function(){
        

        paramsObj.city = 'dep';  //出发城市

        $.jumpTo('searchCity.html',paramsObj);
    });

    //双程返回城市
    $(rt).on('click','.search-addr-back',function(){ 
        paramsObj.city = 'arr';  //返回城市
        $.jumpTo('searchCity.html',paramsObj);
    });



    //单程出发日期
    $(ow).on('click','.search-date-go',function(){ 
        paramsObj.time = 'start';  //出发时间
        $.jumpTo('calendar.html',paramsObj);
    });

    //双程出发日期
    $(rt).on('click','.search-date-go',function(){ 

        paramsObj.time = 'start';  //出发时间
        $.jumpTo('calendar.html',paramsObj);
    });

    //双程返回日期
    $(rt).on('click','.search-date-back',function(){
        paramsObj.time = 'end';  //返回时间
        console.log(paramsObj);
        $.jumpTo('calendar.html',paramsObj); 
    });
    
    // //仓位选择
    // wrap.on('click','.search-positon',function(){
    //     $.condition('#mg-condition',{
    //         onSlideClick:function(el){
    //             console.log(el.innerHTML);
    //         }
    //     });
    // });
    
    

    $.tomsg.show({msg: 'xx'});
    $.tomsg.show({msg: 'xx32'});
    

    setTimeout(function(){
       $.tomsg.show({msg: 'ggg'}); 
    },10000);
    

    //搜索
    wrap.on('click','.mg-search-sub button',function(){
        if(paramsObj.tripType === 'OW'){
            $.jumpTo('flightList.html',{
                channelId:"WEB",
                agencyCode:"WEB",
                departCity: paramsObj.depCityIdOW,
                arrivalCity: paramsObj.arrCityIdOW,
                depDate: paramsObj.startDateOW,
                routeType: paramsObj.tripType
            });
        }else{
            $.jumpTo('flightList.html',{
                channelId:"WEB",
                agencyCode:"WEB",
                departCity: paramsObj.depCityIdRT,
                arrivalCity: paramsObj.arrCityIdRT,
                depDate: paramsObj.startDateRT,
                endDate: paramsObj.endDateRT,
                routeType: paramsObj.tripType
            });
        }
        
    });
    



    function getDayInfo(date,days){

        var d,result = [];

        if(date){
            d = new Date(date); 
        }else{
            d = new Date(); 
        }

        d.setDate(d.getDate() + days);

        var year =  d.getFullYear();

        var month = d.getMonth() + 1; 

        var day = d.getDate(); 

        if(month < 10){ 
            month = "0" + month; 
        }

        if(day < 10){ 
            day = "0" + day; 
        } 

        var val = year + "-" + month + "-" + day;

        var val2 = year + "年" + month + "月" + day + '日';

        var weekday = ["周日","周一","周二","周三","周四","周五","周六"];

        var val3 = weekday[new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).getDay()];

        result.push(val);
        result.push(val2);
        result.push(val3);

        return result; 

    }



    

})(mgui);
