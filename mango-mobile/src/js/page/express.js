/**
 * Created by zhuyu on 2016/10/9.
 */
// 样式引入
require('./../../skin/common/mgui.less');
require('./../../skin/page/express.less');

// js引入
window.CONFIG = require('./../config.js');      // 配置文件，含：api接口信息，项目
window.mgui = require('./../lib/mgui/mgui.js'); // mgui主框
require('./../lib/common.js');
require('./../../skin/common/plugins/condition.less');
require('./../lib/plugins/condition.js');

(function($) {
    var addExpressUrl = 'addexpress.html';
    var doc = document;
    var expressBox = doc.querySelectorAll('.mg-express-list')[0];
    var expressBoxUl = expressBox.querySelectorAll('ul')[0];
    var paramsObj = {};
    //默认参数
    paramsObj.certid = ''; //id，身份证之类
    paramsObj.psgname = ''; //乘客姓名
    paramsObj.psgsex = ''; //乘客性别
    paramsObj.certtype = ''; //乘客身份类型



    $.onRecvData = function(data){
        
        $.extend(true,paramsObj,data);

        initPage();
    };

    function initPage(){

    }

    $(expressBox).on('click', 'i', function(e) {
        $.jumpTo(addExpressUrl,paramsObj);

    });


    $.apiCaller.call({
        api: CONFIG.getApi('getPassenger'),
        showLoading: true, // 显示loading
        method:"POST",
        loadcfg: {
            msg: "加载列表.."
        }, 
        data: {
            
        }
    }, function(res) {
        console.log(res);
        renderPassenger(res);
    });
    
    function renderPassenger(res){
        var data = res.hispsg;
        var li = "";
        data.forEach(function(item,index,local){
            var type = (item.certtype === 'IDC') ? '身份证' + item.certid : '其他' + item.certid;
            li += '<li class="mg-table-view-cell mg-clear">'
                        +'<div class="mg-express-edit mg-span-6">'
                            +'<i class="iconfont icon-bianji" data-title=""></i>'
                            +'<span>'+ item.psgname +'</span>'
                            +'<em>'+ type +'</em>'
                        +'</div>'
                        +'<div class="mg-express-chance mg-span-6">'
                           +'<span class="mg-checkbox-btn">'
                                +'<input class="btn-checkbox" name="express" type="checkbox">'
                                +'<span class="btn-checkbox-outline"></span>'
                            +'</span>'
                        +'</div>'
                +'</li>'
        });

        expressBoxUl.innerHTML = '';
        expressBoxUl.innerHTML = li;

    }
    
})(mgui);
