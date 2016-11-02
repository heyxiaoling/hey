/**
 * Created by zhuyu on 2016/10/17.
 */
// 样式引入
require('./../../skin/common/mgui.less');
require('./../../skin/common/plugins/popup.less');
require('./../../skin/common/plugins/segment.less');
require('./../../skin/common/airlinemap.less');
require('./../../skin/page/flightlist.less');

// js引入
window.CONFIG = require('./../config.js');
window.mgui = require('./../lib/mgui/mgui.js');
window.mgui.template = require('./../lib/template.js');
require('./../lib/common.js');
require('./../lib/plugins/popup.js');
require('./../lib/plugins/segment.js');


(function($) {

    /**
     * 初始
     */
    // 公共变量
    var _flightList = [];
    // 页面接收参数
    var _recvData = {
        // 查询参数
        agencyCode:"WEB",       //
        departCity:"PEK",       // 出发城市三字码
        arrivalCity:"CAN",      // 到达城市三字码
        depDate:"2016-11-07",   // 出发日期
        routeType:"OW",         // 单程往返
        retDate:"2016-11-15",   // 返程日期
        // 低价日历

    }
    // 过滤条件数据
    var _filterData = {};
    // 获取页面传参
    $.onRecvData = function(inData) {
        console.log('Recv:'+JSON.stringify(inData));
        var data = $.extend(_recvData,inData);
        initPage(data);
    };

    // 渲染列表 listData 建议为 _flightList 的克隆，隔离显示渲染数据互相干扰
    var renderList = function(listData) {
        var html = $.template('flight-list-template',{flightList:listData});
        $('#flight-list')[0].innerHTML = html;
    }

    // 顶部日历控件渲染
    var renderCalendar = function(inData) {
        var html = $.template('calendar-bar-template',{data:inData});
        $('#calendar-bar')[0].innerHTML = html;
    }

    // 过滤控件渲染
    var renderFilter = function(inData) {
        var html = $.template('flight-filter-template',_filterData);
        $('#flight-filter')[0].innerHTML = html;
    }

    // 弹出航班过滤组件
    var _filterPop = $("#flight-filter-pop").popup({
        type:"bottom"
    });

    // 页面数据初始化
    var initPage = function(inData){
        $.apiCaller.call({
            api: CONFIG.getApi('queryFlights'),
            showLoading: true, // 显示loading
            data: inData
        }, function(res) {
            // 标题设置
            $.setTitle(res.data.depCityCn+'<i class="iconfont icon-toarrow"></i>'+res.data.arrCityCn);
            // 重新组装航班列表 遍历所有航班中的座次
            _flightList = [];
            _filterData = {
                depAirport:[],
                arrAirport:[],
                room:[],
                plane:[],
                company:[],
                airline:[]
            };
            for(var i=0;i<res.data.flightDataListMap.length;i++) {
                for(var j=0;j<res.data.flightDataListMap[i].seatAndPolicyList.length;j++) {
                    _flightList.push({
                        //
                        "departCity" :inData.departCity,
                        "arrivalCity" :inData.arrivalCity,
                        "routeType" :inData.routeType,
                        "depDate": inData.depDate,
                        // 航班
                        "stop": res.data.flightDataListMap[i].stop,
                        "airlineCn": res.data.flightDataListMap[i].airlineCn,
                        "flightNo": res.data.flightDataListMap[i].flightNo,
                        "planeType": res.data.flightDataListMap[i].planeType,
                        "depAirPortCn": res.data.flightDataListMap[i].depAirPortCn,
                        "depAirPort": res.data.flightDataListMap[i].depAirPort,
                        "depTime": res.data.flightDataListMap[i].depTime,
                        "arrAirPortCn": res.data.flightDataListMap[i].arrAirPortCn,
                        "arrAirPort": res.data.flightDataListMap[i].arrAirPort,
                        "arrTime": res.data.flightDataListMap[i].arrTime,
                        "arrDate": res.data.flightDataListMap[i].arrDate,
                        "airLineCode":res.data.flightDataListMap[i].airLineCode,
                        // 坐席
                        "cabinName": res.data.flightDataListMap[i].seatAndPolicyList[j].cabinName,
                        "adultPrice": res.data.flightDataListMap[i].seatAndPolicyList[j].adultPrice,
                        "adultDiscount": res.data.flightDataListMap[i].seatAndPolicyList[j].adultDiscount,
                        "policyType": res.data.flightDataListMap[i].seatAndPolicyList[j].policyType
                    });
                    _filterData.depAirport.indexOf(res.data.flightDataListMap[i].depAirPortCn)==-1 &&
                    _filterData.depAirport.push(res.data.flightDataListMap[i].depAirPortCn);
                    _filterData.arrAirport.indexOf(res.data.flightDataListMap[i].arrAirPortCn)==-1 &&
                    _filterData.arrAirport.push(res.data.flightDataListMap[i].arrAirPortCn);
                    _filterData.plane.indexOf(res.data.flightDataListMap[i].planeType)==-1 &&
                    _filterData.plane.push(res.data.flightDataListMap[i].planeType);
                    _filterData.room.indexOf(res.data.flightDataListMap[i].seatAndPolicyList[j].cabinName)==-1 &&
                    _filterData.room.push(res.data.flightDataListMap[i].seatAndPolicyList[j].cabinName);
                    _filterData.company.indexOf(res.data.flightDataListMap[i].airlineCn)==-1 &&
                    _filterData.company.push(res.data.flightDataListMap[i].airlineCn);
                    _filterData.airline.indexOf(res.data.flightDataListMap[i].airLineCode)==-1 &&
                    _filterData.airline.push(res.data.flightDataListMap[i].airLineCode);
                }
            }
            renderList($.clone(_flightList));
            renderCalendar({
                depDate:res.data.depDate,
                routeType:"RT",         // 单程往返
            });
            renderFilter();
        });
    }

    /**
     * 业务方法
     */
    // 机票列表冒泡排序
    var flightBubble = function(exeStr){
        var i = _flightList.length, j;
        var tmpObj;
        while (i > 0) {
            for (j = 0; j < i - 1; j++) {
                if (eval(exeStr)) {
                    tmpObj = _flightList[j];
                    _flightList[j] = _flightList[j + 1];
                    _flightList[j + 1] = tmpObj;
                }
            }
            i--;
        }
    }
    // 价格排序切换
    var _togglePrice = true;
    var togglePrice = function() {
        _togglePrice = _togglePrice?false:true;
        flightBubble('_flightList[j].adultPrice '+(_togglePrice?'<':'>')+' _flightList[j+1].adultPrice');
        renderList($.clone(_flightList));
    }
    // 时间排序切换
    var _toggleTime = true;
    var toggleTime = function() {
        _toggleTime = _toggleTime?false:true;
        flightBubble('_flightList[j].depTime '+(_toggleTime?'<':'>')+' _flightList[j+1].depTime');
        renderList($.clone(_flightList));
    }


    /**
     * 事件监听
     */
    $(".mg-bar-tab").on("click","a",function(e){
        switch (this.id) {
            case "sort-by-filter":
                _filterPop.show();
                break;
            case "sort-by-time":
                toggleTime();
                break;
            case "sort-by-price":
                togglePrice();
                break;
            default :
                break;
        }
    });
    // 日历控件
    $("#calendar-bar").on("click","a",function(e){
        switch (this.id) {
            case "prev-day":
                break;
            case "next-day":
                break;
            case "set-date":
                $.jumpTo('calendar.html',{
                    tagPage:"flightList.html",
                    tripType: _recvData.routeType,             //OW单程，RT往返程  //默认单程
                    startDate: _recvData.depDate, //出发时间
                    endDate: _recvData.retDate, //返回时间
                    position: '', //仓位
                    depCityId: _recvData.departCity, // 出发城市三字码  //默认深圳
                    arrCityId: _recvData.arrivalCity, // 到达城市三字码
                    depCityCityName: '', // 出发城市名称  //默认深圳
                    arrCityCityName: '', // 到达城市名称
                    city: 'dep', // dep 出发城市 arr 到达城市 //默认出发城市
                    time: 'start', //  start出发时间 end到达时间 //默认出发时间
                });
                break;
            default :
                break;
        }
    });
    // 航班列表
    $("#flight-list").on("click","a",function(e){
        $.jumpTo("flightDetail.html",$.queryToObj(this.href));
        return false;
    });
    // 过滤控件
    $("#flight-filter-pop").on("click","a",function(e){
        switch (this.id) {
            case "filter-confirm":
                _filterPop.hide();
                break;
            case "filter-clear":
                _filterPop.hide();
                break;
            default :
                break;
        }
    });

})(mgui);

