/**
 * Created by zhuyu on 2016/10/19.
 */
// 样式引入
require('./../../skin/common/mgui.less');
require('./../../skin/common/plugins/popup.less');
require('./../../skin/common/plugins/popup-style.less');
require('./../../skin/page/order.less');

// js引入
window.CONFIG = require('./../config.js');
window.mgui = require('./../lib/mgui/mgui.js');
window.mgui.template = require('./../lib/template.js');
require('./../lib/common.js');
require('./../lib/plugins/popup.js');

(function($) {

    /**
     * 初始
     */

    var _recvData = {
        // 订单初始化字段
        tripType:"",	// 行程类型
        policyId:"",	// 政策ID
        policyType:"",	// 政策类型
        fareItemId:"",	// 运价条目ID
        airways:"",	    // 航空公司
        classNO:"",	    // 舱位
        depDate:"",	    // 出发日期
        depTime:"",	    // 出发时间
        depCity:"",	    // 出发地
        arrCity:"",	    // 目的地
        price:"",	    // 价格
        supplier:"",	// 供应商
        discount:"",	// 折扣
        param1:""	    // 保留字段

    }
    $.onRecvData = function(inData) {
        console.log('Recv:'+JSON.stringify(inData));
        data = $.extend(_recvData,inData);
        initPage(data);
    };
    // 页面初始化方法
    var initPage = function(data) {
        $.apiCaller.call({
            api:CONFIG.getApi('createOrderBefore'),
            showLoading:true,
            lockScreen:true,
            data:data
        },function(res){
            $.setTitle('深圳<i class="iconfont icon-toarrow"></i>北京');
        });
    }

    /**
     * 业务方法
     */
    // 退订规定弹窗
    var _provisPop = $("#provis-pop").popup();
    // 费用明细弹窗
    var _feePop = $("#fee-pop").popup({
        type:"bottom"
    });
    var _luggagePop = $("#luggage-pop").popup();
    // 需要对iframe重复加载做校验
    //if(!_luggagePop[0].querySelector('iframe')){
    //    var luggagePopFrame = document.createElement('iframe');
    //    luggagePopFrame.src = CONFIG.getApi('luggageInfo');
    //    _luggagePop[0].querySelector('.dialog-content').appendChild(luggagePopFrame);
    //}
    /**
     * 事件监听
     */
    $('body').on('click','a',function(e){
        switch (this.id) {
            case 'provis-info':
                // 退改规定弹出
                _provisPop.show();
                break;
            case 'luggage-info':
                // 行李托运须知
                _luggagePop.show();
                break;
            case 'fee-detail':
                // 费用明细
                _feePop.show();
                break;
            case 'chose-passenger':
                // 选择乘客
                $.jumpTo('passengerList.html');
                break;
            default:
                break;
        }
    });
    $('#expenses-form').on('click','a',function(e){
        switch (this.id) {
            case 'express-type':
                $.jumpTo('express.html');
                break;
            default:
                break;
        }
    });

})(mgui);
