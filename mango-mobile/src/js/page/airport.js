/**
 * Created by zhuyu on 2016/10/9.
 */
// 样式引入
require('./../../skin/common/mgui.less');
require('./../../skin/page/airport.less');
// js引入
window.CONFIG = require('./../config.js');      // 配置文件，含：api接口信息，项目信�
window.mgui = require('./../lib/mgui/mgui.js'); // mgui主框�
require('./../lib/common.js');
require('./../../skin/common/plugins/msg.less');
require('./../lib/plugins/msg.js');
require('./../../skin/common/plugins/condition.less');
require('./../lib/plugins/condition.js');

(function($) {
    var paramsObj = {},airPortInfo = [],airPortNum = -1;
    var airPort = document.querySelectorAll('.mg-airport-wrap')[0];
    var airportBox = document.querySelector('#mg-airport');
    var airPortUl = airportBox.querySelectorAll('ul')[0];
    var counterBox = document.querySelector('#mg-counter');
    var counterUl = counterBox.querySelectorAll('ul')[0];
    var inputAirPort = airPort.querySelectorAll('input')[0];
    console.log(airPort);
    paramsObj.depart = "SZX"; //出发城市三字码  //先用深圳测试
    paramsObj.arrive = "SHA";  //到达城市三字码 //先用上海测试

    


    //机场选择
    $.onRecvData = function(data){

        $.extend(true,paramsObj,data);


        console.log(paramsObj);
        initPage();
    }


    $(airPort).on('click','.airport-chance',function(){
        var _this = this;
        $.condition('#mg-airport',{
            onSlideClick:function(el){
                console.log(el.innerHTML);
                airPortNum = parseInt(el.title);
                _this.value = el.innerHTML;
            }
        });
            
    });
    //柜台选择
    $(airPort).on('click','.counter-chance',function(){
        var _this = this;
        //选择柜台前选择机场
        if(airPortNum < 0){
            $.msg({
                type: 'alert',
                text: '请选择机场'
            });

            return false;
        }

        var info = airPortInfo[airPortNum];
        var li = '';
        console.log(info);
        info.counters.forEach(function(item,index,local){
            li += '<li class="mg-condition-slide  mg-txt-center">'+item.counterName+'</li>'
        });
        console.log(li);
        counterUl.innerHTML = '';
        counterUl.innerHTML = li;

        $.condition('#mg-counter',{
            onSlideClick:function(el){
                console.log(el.innerHTML);
                _this.value = el.innerHTML;
            }
        });
          
    });
    function initPage(){
        

        console.log(paramsObj);
        $.apiCaller.call({
            api: CONFIG.getApi('getAirportAndCounter'),
            showLoading: true, // 显示loading
            loadcfg: {
                msg: "加载列表.."
            }, // loading 消息配置
            data: {
                "depart": paramsObj.depart,
                "arrive": paramsObj.arrive
            }
        }, function(res) {
            console.log(res);
            renderAirPort(res);
        });


        function renderAirPort(res){
            var li = '';
            var data = res.data.airPortCounters;
            data.forEach(function(item,index,local){
                li += '<li class="mg-condition-slide mg-txt-center" title="'+index+'">'+item.airport+'</li>';
                airPortInfo.push(item);
            });

            console.log(airPortInfo);

            airPortUl.innerHTML = li;
        }
    
    }
    
})(mgui);
