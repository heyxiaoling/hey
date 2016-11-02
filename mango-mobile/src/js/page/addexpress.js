/**
 * Created by zhuyu on 2016/10/9.
 */
// 样式引入
require('./../../skin/common/mgui.less');
require('./../../skin/page/addexpress.less');

// js引入
window.CONFIG = require('./../config.js');      // 配置文件，含：api接口信息，项目信�
window.mgui = require('./../lib/mgui/mgui.js'); // mgui主框�
require('./../lib/common.js');
require('./../../skin/common/plugins/condition.less');
require('./../lib/plugins/condition.js');

(function($) {
    var paramsObj = {};
    $('.mg-add-express-list').on('click','.addr-chance',function(){
        var _this = this;
        $.condition('#mg-add-express-condition',{
            onSlideClick:function(el){
                _this.value = el.innerHTML;
            }
        });
    });


    $.onRecvData = function(data){
        
        $.extend(true,paramsObj,data);

        console.log(paramsObj);

        initPage();
    };

    function initPage(){

    }
    
})(mgui);
