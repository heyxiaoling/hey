/**
 * Created by zhuyu on 2016/10/19.
 */
// 样式引入
require('./../../skin/common/mgui.less');
require('./../../skin/page/demo.less');
require('./../../skin/common/plugins/popup.less');      // 弹窗控件
require('./../../skin/common/airlinemap.less');      // 弹窗控件

// js引入
window.CONFIG = require('./../config.js'); // 配置文件，含：api接口信息，项目信�
window.mgui = require('./../lib/mgui/mgui.js'); // mgui主框�
window.mgui.template = require('./../lib/template.js');
require('./../lib/common.js');
require('./../lib/location.js');
require('./../../skin/common/plugins/msg.less');
require('./../lib/plugins/msg.js');
require('./../lib/tab.js');
require('./../../skin/common/plugins/condition.less');
require('./../lib/plugins/condition.js');
require('./../lib/plugins/popup.js');                   // 弹窗控件

(function($) {

    /**
     * 初始
     */
    // ajax 基础调用方法
    //$.ajax({
    //    type: 'POST',
    //    url: CONFIG.getApi('getFlightCities'),
    //    // data to be added to query string:
    //    data: { },
    //    // type of data we are expecting in return:
    //    dataType: 'json',
    //    timeout: 300,
    //    context: $('body'),
    //    success: function(data){
    //        // console.log(JSON.stringify(data));
    //    },
    //    error: function(xhr, type){
    //        // TODO ajax error
    //    }
    //})
    // ajax 封装后调用方
    $.apiCaller.call({
        api: CONFIG.getApi('getFlightCities'),
        showLoading: true, // 显示loading
        method:"POST",
        loadcfg: {
            msg: "加载列表.."
        }, // loading 消息配置
        data: {}
    }, function(res) {
        console.log(JSON.stringify(res));
        // template.js 使用
        var html = $.template('list-template', res.data);
        $('#main-content')[0].innerHTML = html;
    });

    // 表单初始化方法 可以通过queryString 或 json对象初始化
    $("#test-form").setForm({
        name: "张三",
        phone: "18677445547",
        area: "广东深圳",
        express: "on",
        drop: "item3",
        radio: "item3",
        multCheck: ["item1", "item2"]
    });
    // 表单数据系列转换方法
    var formData = $("#test-form").serialize(); // 表单转换为数据对象
    var queryString = $.objToQuery(formData); // 数据对象转queryString
    console.log(queryString);
    var dataObj = $.queryToObj(queryString);
    console.log(JSON.stringify(dataObj));
    $("#test-form").setForm("http://localhost?" + queryString); // 也可以使用url直接初始化表单 直接使用queryString也可以

    $("#test-form").on("click","#sub-button",function(e){
        var queryStr = $.objToQuery($("#test-form").serialize());
        $.jumpTo('demo.html?'+queryStr);
    });

    $.onRecvData = function(data){
        // TODO 在页面中重写以获取参数
        console.log(JSON.stringify(data));
    };

    // select 底部弹出
    $("select").popup();
    // 弹窗
    var popDom = $("#popup-demo").popup({
        type:"top",           // top 顶部下拉，bottom底部上弹，默认弹出则不用传入type值
        mask:true,               // 默认true,非必填，是否有遮罩
        autoHide:true            // 默认true,非必填，点击遮罩是否自动隐藏
    });
    //popDom.show(); // 弹出方法
    //popDom.hide(); // 关闭方法 TODO 调用时不要在弹出马上关闭

    /**
     * 业务方法
     */
        // loading组件使用demo
    $.loading.show({
        msg: "测试消息.."
    });
    setTimeout(function() {
        $.loading.hide();
    }, 2000);

    // $.msg({
    //     type: 'alert',
    //     text: '信息有误',
    //     callback: function(){
    //     }
    // });

    $.getLocation(function(data) {
        console.log(data);
    });

    $.tab('#mg-tab', {});

    /**
     * 事件监听
     */
    $('#main-content').on('click', 'li.mg-table-view-cell', function(e) {
        //console.log('shown', e.detail.id);//detail为当前popover元素
        $.jumpTo('mg-button.html?');

    });

    //底部列表
    $('.mg-content').on('click', '.condition-chance-btn', function() {
        $.condition('#mg-condition', {
            onSlideClick: function(el) {
                console.log(el.innerHTML);
            }
        });
    });
    // $(document).on('click',function(){
    //     alert(1);
    // })
})(mgui);