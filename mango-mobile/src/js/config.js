/**
 * Created by zhuyu on 2016/10/10.
 * 配置目录，包括api接口地址等信�
 */
module.exports = (function(){
    // 私有变量，通过方法只读
    var debug = true;
    var serverHost = "http://apitest.mangocity.com:8001/apiserver/"; // 服务器host
    var hostName = "http://"+document.location.hostname+":8888/mock/";
    var info = {
        uid:"1045",
        sid:"1045001",
        timeOut:20 // 支付超时时间 min
    };
    var api = debug ? {
        // debug mock测试接口
        demoApi : hostName + "demo.json",

        //[[ 机票业务�
        getFlightCities : hostName + "iflight/getFlightCities.json",                   // 城市列表查询
        queryLowPrice : hostName + "iflight/queryLowPrice.json",
        queryFlights: hostName + "iflight/queryFlights.json",                          // 航班列表+（部分）舱位
        queryAllFlights: hostName + "iflight/queryAllFlights.json",                    // 航班列表+（部分）舱位
       	queryFlightStopInfo : hostName+"iflight/queryFlightStopInfo",				    //航班经停信息
       	queryProvisionInfo : hostName+"iflight/queryProvisionInfo",					//退订规�

        luggageInfo : "http://www.mangocity.com/3g/msite/desc/index.html",                      // 行李托运须知数据来源
        accidentRiskInfo: "http://www.mangocity.com/3g/flight_insurence/baoxian/index.html",     // 意外险数据来�
        //[[ 常用旅客(乘机�
		queryHisPsg : hostName + "iflight/queryHisPsg.json", //乘机人列�
		addHisPsg : hostName + "iflight/addHisPsg.json",		//添加乘机�
        getPassenger: hostName + "iflight/passenger.json",   //常用旅客
		//]]常用旅客(
        //]]
    } : {
        // release 正式接口
        demoApi : serverHost + "demo.json",

        //[[ 机票业务�
        getFlightCities : serverHost + "iflight/getFlightCities",                   // 城市列表查询
        queryLowPrice : serverHost + "iflight/queryLowPrice",                       // 获取低价日历
        getAirportAndCounter: serverHost + "iflight/getAirportAndCounter",          // 查询机场柜台信息
        queryFlights: serverHost + "iflight/queryFlights",                          // 航班列表+（部分）舱位
        queryAllFlights: serverHost + "iflight/queryAllFlights",                    // 指定航班的全部舱位列�
        queryFlightStopInfo : serverHost+"iflight/queryFlightStopInfo",				//航班经停信息
        createOrderBefore: serverHost + "iflight/createOrderBefore",                // 创建订单初始�

        luggageInfo : "http://www.mangocity.com/3g/msite/desc/index.html",                      // 行李托运须知数据来源
        accidentRiskInfo: "http://www.mangocity.com/3g/flight_insurence/baoxian/index.html",     // 意外险数据来�
        //]] 机票业务�
		//[[ 常用旅客(乘机�
		queryHisPsg:"http://mt.mangocity.com/api/index.php?c=member&m=queryHisPsg",		//乘机人列�
		addHisPsg:"http://mt.mangocity.com/api/index.php?c=member&m=addHisPsg",			//添加乘机�
        getPassenger: "http://mt.mangocity.com/html5/f/hispsg.shtml?mkey=f70a800bf60f59dbb8bbd7ee06548338",   //常用旅客
		//]]常用旅客(乘机�
    }
    // 返回获取器对�
    return {
        getApi : function(in_name) {
            return api[in_name] ? api[in_name] : null;
        },
        getInfo : function(in_name) {
            return info[in_name] ? info[in_name] : null;
        },
        isDebug : function(){
            return debug;
        }
    }
})();