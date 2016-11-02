/**
 * Created by zhuyu on 2016/10/14.
 * 首页iframe路由
 */
require('./../../skin/common/mgui.less');
require('./../../skin/page/index.less');

window.mgui = require('./../lib/mgui/mgui.js');
require('./../lib/common.js');


(function($){

    /* 公共变量 */
    var _hash = location.hash.replace(/^#(.)/, '$1');
    var _defaultUrl = _hash==""?"search.html":_hash;
    var _cashFrame = 3; //缓存frame个数
    var _frameGroup = document.getElementById("slider-frames");
    var _history = []; // 独立历史记录
    var _dataBridge = {}; // 页面间传参数据

    // 页面打开方法
    window.jumpTo = function(inConfig) {
        var config = {
            url:"",         // 参数1：跳转url
            renew:false,    // 参数2：默认false,优先检查跳转是否为上级页面。true:强制打开链接为下一个页面。
            clear:false,    // 参数3：true:清除所有缓存页，重头打开  false:保留缓存页，滑动加载
            data:null,
            hashChange:false    // 通过浏览器返回按钮改变hash的跳转
        };
        config = $.extend(config,inConfig);

        $.loading.show();

        if (config.clear) {
            _history = [];
        }
        // 倒计数，方便释放缓存页
        var count = 0;
        for (var i=_frameGroup.children.length-1; i>=0; i--) {
            count++;
            if (config.clear){// || count>_cashFrame) {
                _frameGroup.removeChild(_frameGroup.children[i]);
            } else {
                _frameGroup.children[i].className = "slider-item";
            }
        }

        // 打开新页面
        var openNew = function() {
            var nframe = null;
            if (_history.length>=_frameGroup.children.length) { // 无frame则创建
                nframe = document.createElement('iframe');
                nframe.className = "slider-item active";
                //nframe.scrolling = "no";
                _frameGroup.appendChild(nframe);
            } else {
                nframe = _frameGroup.children[_history.length];
            }
            nframe.src = config.url;
            window.location.hash = config.url; // 存入hash路由
            _history.push(config.url.split('?')[0]);
            // 页面加载完成
            nframe.onload = function() {
                $.loading.hide();
                // 修复mg-content在iframe中的显示尺寸问题
                var tmpDom = this.contentWindow.document.body.querySelector('.mg-content');
                tmpDom.style.width = window.innerWidth+'px';
                tmpDom.style.height = window.innerHeight+'px';
                // 窗口尺寸改变，重置容器尺寸
                this.contentWindow.onresize = function () {
                    var contentDom = this.document.body.querySelector('.mg-content');
                    contentDom.style.width = window.innerWidth+'px';
                    contentDom.style.height = window.innerHeight+'px';
                }
                // 传入页面参数
                if(this.contentWindow.mgui){
                    config.data = $.extend(config.data,$.queryToObj(this.contentWindow.document.baseURI));
                    this.contentWindow.mgui.onRecvData(config.data);
                }
            };
            // 偏移动画执行完后隐藏
            nframe.addEventListener('webkitTransitionEnd', function (e) {
                if(this.className.indexOf('active')==-1) {
                    this.style.display = "none";
                }
            }, false);
        }

        if( config.renew==true ) {
            openNew();
        } else {
            if ( _history.length < 1 ) {  // 没有历史记录时创建新页
                openNew();
            } else {
                var fIndex = _history.indexOf(config.url.split('?')[0]);
                console.log("findex"+fIndex);
                if(fIndex==-1){
                    openNew();
                } else {
                    backTo(fIndex,config.hashChange,config.data);
                }
            }
        }
    };

    // 页面回退方法
    window.backTo = function(){
        var index = arguments[0] || _history.length-2;
        /**
         * backTo 入口1：jumpTo,入口2：页面back按钮
         * jumpTo 过滤掉了index-1的情况，此处-1时表示页面已刷新，或者为初始页
         */
        if(index<0){
            _history.pop(); //
            history.go(-1);
            return;
        }
        var backCount = _history.length-(index+1);
        for(var i=0;i<backCount;i++) {
            _frameGroup.removeChild(_frameGroup.lastChild);
            _history.pop();
        }
        if(arguments[2] && _frameGroup.lastChild.contentWindow.mgui){
            var data = $.extend(arguments[2],$.queryToObj(_frameGroup.lastChild.contentWindow.document.baseURI));
            _frameGroup.lastChild.contentWindow.mgui.onRecvData(data);
        }
        _frameGroup.lastChild.style.display = "block";
        // 需要设置一定延迟避免隐藏显示对动画的干扰
        setTimeout(function(){
            _frameGroup.lastChild.className = "slider-item active";
        },10)
        arguments[1] || history.go(-backCount);
        $.loading.hide();
    };

    // 浏览器回退hash重定向
    if( ("onhashchange" in window) && ((typeof document.documentMode==="undefined") || document.documentMode==8)) {
        // 浏览器支持onhashchange事件
        window.onhashchange = function(e) {
            var localHash = location.hash.replace(/^#(.)/, '$1');
            // 对hash进行校验，补偿浏览器前进返回操作
            if(localHash != _frameGroup.lastChild.attributes['src'].nodeValue){
                jumpTo({
                    url:localHash,
                    clear:_history.length<=1,
                    hashChange:true
                });
            }
        };
    } else {
        console.log('浏览器不支持hash监听');
    }

    //setTimeout(function(){
    //    location.reload(true);
    //},1000)

    jumpTo({
        url:_defaultUrl
    });

})(mgui);

// 二维码调试代码TODO 正式环境需移除
(function(){
    var deUrl = encodeURIComponent(window.document.baseURI);
    console.log('二维码:\nhttp://qrcode.shuogesha.com/qrcode?pixel=100_100&content='+deUrl);
})();