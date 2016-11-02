

/**
 * ajax封装，只用于支持XMLHttpRequest，用于移动端
 * @param  {[type]} obj 对象 url,type,data,dataType,success,error
 * @return {[type]}
 */
function getDataFromAPI(obj){
    var abj = {};
    
    abj.type = "POST";
    abj.url = "";
    abj.dataType = "json";
    abj.data = {};
    abj.success = function(data){
        console.log('成功回流' + data);
    };
    abj.error = function(data){
        console.log('失败回流' + data);
    };

    $.extend(true,abj,obj);

    // 测试地址
    // abj.url = 'http://10.10.130.212:8001/' + obj.url;
    abj.url = 'http://apitest.mangocity.com:8001/apiserver/' + abj.url;
    abj.data = JSON.stringify(abj.data);

    $.ajax(abj);

}


/**
 * [setCookie 设置cookie]
 * @param {[type]} cName  [key值]
 * @param {[type]} value  [value值]
 * @param {[type]} expire [过期时间(天)]
 */
window.setCookie = function(cName,value,expire){
    var expireDate = new Date();
    expireDate.setTime(expireDate.getTime()+expire*24*60*60*1000);
    document.cookie = cName + "=" + escape(value) + ((expire==null) ? "" : ";expires="+expireDate.toGMTString());
}


/**
 * [getCookie 获取cookie]
 * @param  {[type]} cName [key值]
 */
window.getCookie = function(cName){
    var arr = document.cookie.match(new RegExp(["(^| )" , cName , "=([^;]*)(;|$)"].join('')));
    if(arr != null) return unescape(arr[2]); return null;
}


/**
 * [MgSessionSet sessionStorage set]
 * @param  {[type]} key [key值]
 * @param  {[type]} value  [value值]
 */
window.MgSessionSet = function(key, value) {
    window.sessionStorage.setItem(key, value);
}


/**
 * [MgSessionGet sessionStorage get]
 * @param {[type]} key [key值]
 */
window.MgSessionGet = function(key) {
    var result = window.sessionStorage.getItem(key);
    if (result == '' || result == "undefined" || result == "null" || result == null || result == undefined) {
        return '';
    };
    return result;
}


/**
 * [MgLocalSet localStorage set]
 * @param {[type]} key   [key值]
 * @param {[type]} value [value值]
 */
window.MgLocalSet = function(key, value) {
    window.localStorage.setItem(key, value);
}


/**
 * [MgLocalGet localStorage get]
 * @param {[type]} key [key值]
 */
window.MgLocalGet = function(key) {
    var result = window.localStorage.getItem(key);
    if (result == '' || result == "undefined" || result == "null" || result == null || result == undefined) {
        return '';
    };
    return result;
}


/**
 * 获取url参数
 */
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
    var r = window.location.search.substr(1).match(reg);
    if (r!=null) {
        return decodeURI(r[2]);
    }
    return null;
}


/**
 * 获取订单状态
 */
function orderStatus(state){
    var arr = ["待支付","待处理","已寄单","待出签","已出签","已取消","出签失败","已退款","已过期","待确认","待审核","审核通过","审核不通过","已收单","已送签","已完成","已销签","待面签"];
    return arr[parseInt(state, 10)];
}



/**
 * [Msg description]
 * @param {[type]} options [description]
 * 弹窗
 * 
 * type,'confirm' 确认取消弹出框,'alert' 弹出确认框
 * title:'',       //标题文字
 * text :'',       //内容文字
 * btnOkText : '确定',   //按钮文字
 * btnNoText : '取消',   //按钮文字
 * maskbtn : true,     //是否显示遮罩
 * auto_close:false,   //自动消失
 * success:function(){}, //成功回调函数
 * failed:function(){} //失败回调函数
 *
 */
function Msg(options){
    this.seting = {
        type:'confirm',
        title:'',       
        text :'',       
        btnOkText : '确定',   
        btnNoText : '取消',   
        maskbtn : true,     
        autoClose:false,
        autoCloseTime: 500, 
        success:function(){},
        failed:function(){}
    }
    
    $.extend(true,this.seting,options);
    this.init();
}

Msg.prototype.init=function(){
    var doc = document,
        bd =  doc.body,
        dialogExist = doc.querySelector('#dialog');

    var dialog = '<div class="dialog" id="dialog">'
                    +'<div class="dialog-mask" id="dialog-mask" name="dialog-mask"></div>'
                    +'<div name="dialog-msg" class="dialog-msg" id="dialog-msg"></div>'
                +'</div>',
                dialogMsgTitle = '<div class="dialog-title"><strong class="dialog-title-content">'+this.seting.title+'</strong></div>',
                dialogMsgContent = '<div class="dialog-msg-content">'+this.seting.text+'</div>';


    if(dialogExist){
        return false;
    }

    bd.insertAdjacentHTML('beforeEnd', dialog);

    this.dialog = doc.querySelector('#dialog');
    this.dialogMsg = this.dialog.querySelector('#dialog-msg');

    this.dialogMsg.insertAdjacentHTML('beforeEnd', dialogMsgTitle);
    this.dialogMsg.insertAdjacentHTML('beforeEnd', dialogMsgContent);

    switch(this.seting.type){
        case "confirm":
            //确认框
            this.confirm();
            break;
        case "alert":
            //警告框
            this.alert();
            break;
        case "custom-dialog":
            this.customDialog();
            break;
        case "autoClose":
            this.autoClose();
            break;
        default:
            //警告框
            this.alert();
            break;
    }
}

Msg.prototype.confirm=function(){
    var dialogMsgBottom = '<div class="dialog-bottom">'
                            +'<span href="javascript:;" class="dialog-bottom-cancel">'+this.seting.btnNoText+'</span>'
                            +'<span href="javascript:;" class="dialog-bottom-sure">'+this.seting.btnOkText+'</span>'
                        +'</div>';

    this.dialogMsg.insertAdjacentHTML('beforeEnd', dialogMsgBottom);
    this.handlerSuccess();
    this.handlerFailed();
}
Msg.prototype.alert=function(){
    var dialogMsgBottom = '<div class="dialog-bottom">'
                            +'<span href="javascript:;" class="dialog-bottom-sure">'+this.seting.btnOkText+'</span>'
                        +'</div>';
    this.dialogMsg.insertAdjacentHTML('beforeEnd', dialogMsgBottom);
    this.handlerSuccess();
}


Msg.prototype.customDialog=function(){
    var dialogMsgBottom = '<div class="dialog-bottom">'
                            +'<span href="javascript:;" class="dialog-bottom-sure">'+this.seting.btnOkText+'</span>'
                        +'</div>';
    this.dialogMsg.insertAdjacentHTML('beforeEnd', dialogMsgBottom);
    this.handlerSuccess();
}

Msg.prototype.autoClose=function(){
    var _this = this;
    var dialogMsgBottom = '<div class="dialog-bottom">'
                            +'<span href="javascript:;" class="dialog-bottom-sure"></span>'
                        +'</div>';
    _this.dialogMsg.insertAdjacentHTML('beforeEnd', dialogMsgBottom);
    setTimeout(function(){
        _this.hide();
    },_this.seting.autoCloseTime);
}


Msg.prototype.handlerSuccess=function(){
    var _this=this;
    _this.dialogMsg.querySelector('.dialog-bottom-sure').addEventListener('click',function(event){
        var event=event||window.event;

        if(event.stopPropagation){
            event.stopPropagation();
        }else{
            event.cancelBulle=true;
        }


        if(_this.seting.success && Object.prototype.toString.call(_this.seting.success) == "[object Function]"){
            _this.seting.success.call(this,_this.dialog);
            _this.hide();
        }

    },false);
}

Msg.prototype.handlerFailed=function(){
    var _this=this;
    _this.dialogMsg.querySelector('.dialog-bottom-cancel').addEventListener('click',function(event){
        var event=event||window.event;
        if(event.stopPropagation){
            event.stopPropagation();
        }else{
            event.cancelBulle=true;
        }
        if(_this.seting.failed && Object.prototype.toString.call(_this.seting.failed) == "[object Function]"){
            _this.seting.failed.call(this,_this.dialog);
            _this.hide();
        }
    },false);
}


Msg.prototype.hide=function(){
    var _this = this;
    _this.dialog.parentNode.removeChild(_this.dialog);
}

function msg(options){
    var m = new Msg(options);
    return m;
}

/**
 * 检查是否登录
 * 如发现未登录则调跳转登录，登录后返回backUrl
 * 登录成功的情况返回success
 */
/**
 * [checkLogin description]
 * @param  {[type]} ltype   [description]
 * @param  {[type]} backUrl [description]
 * @return {[type]}         [description]
 */
function checkLogin(ltype, backUrl) {

    var f = "";
    ltype = ltype != null ? ltype : 1;

    $.ajax({
        url: "http://mt.mangocity.com/html5/f/checklogin.shtml",
        dataType: "json",
        data: {
            "mkey": sessionStorage.getItem("mkey")
        },
        async: false,
        success: function(data, textStatus) {
            
            f = data.flag;
            if (f == "success") {
                sessionStorage.setItem("reg_mobile", data.mobile);
            }
        }
    });

     if (f != 'success') {
        var isunmember = sessionStorage.getItem('user:type');
        if (isunmember) {
            f = "unmember";
        } else {
            location.href = "http://mt.mangocity.com/views/user/login.html?type=" + ltype + "&returnUrl=" + encodeURIComponent(backUrl);
        }
       
    } else {
        f = "success";
    }
    return f;
}


/**
 * 获取会员信息
 * (仅在登录场景下)
 * 开发场景下使用mt.mangocity.com 的URL
 */
function getMbrInfo() {
    var mrid = '';
    var mkey = sessionStorage.getItem("mkey");
    if (mkey) {

        $.ajax({
            type: "post",
            url: "http://mt.mangocity.com/api/index.php?c=member&m=get_user_info",
            dataType: "json",
            data: {
                "mkey": mkey
            },
            async: false,
            success: function(data, textStatus) {
                if (data) {
                     
                    if (data.code && '0000' == data.code) {
                        mrid = data.data.mbrID;
                    }
                }
            }
        });


    }

    return mrid;
}

 

/**
 * 非登录状态下获取会员信息
 * (仅在非登录场景)
 */
function getdefaultMbr() {
    var defaultMbr = {
        "attribute": 1,
        "defaultMbrship_cd": "660016080703",
        "mbrCd": "MGO02000064875096",
        "mbrId": 43944983,
        "mbrLevel": "One",
        "mbrType": "Individual"
    };
    return defaultMbr.mbrId;
}


/**
 * [imgLoad description]
 * @return {[type]} [description]
 * <img src="../img/default.png"  data-src=""  alt="#">
 */
function imgOnLoad(obj){
    var img = new Image(),
        loadSrc = obj.attributes["data-src"].value;
    

    img.onerror=function(){
        console.log('img failed');
        return false;
    };

    img.onload = function () {
        obj.parentNode.replaceChild(img, obj);
        img.onload = null;
    };

    
    img.src = loadSrc;    
}


/**
 * [Load description]
 * loading
 * 
 */
function Load(options,callback){
    this.seting = {
        contain: '',
        callback: function(){}
    }
    this.callback = callback || function(){};

    $.extend(true,this.seting,options);
    
    this.init();

    return $;
}

Load.prototype = {
    constructor: Load,
    init: function(){
        var doc = document,
            bd =  doc.body;

        var load = '<div class="load" id="load"></div>'

        bd.insertAdjacentHTML('beforeEnd', load);

        this.load = doc.querySelector('#load');

        this.show();
    },
    show: function(){
        this.seting.contain ? this.contain() : this.wrap();
    },
    hide: function(){

    },
    wrap: function(){
        var contain = '<div class="load-mask" id="load-mask" name="load-mask"></div><div class="load-content" ><span class="load-img"></span></div>'
        this.load.insertAdjacentHTML('beforeEnd', contain);
        this.callback.call(this);
    },
    contain: function(){
        var contain = '<div id="'+this.seting.contain+'" ><div class="load-content" ><span class="load-img"></span></div></div>' 
        this.load.insertAdjacentHTML('beforeEnd', contain);
        this.callback.call(this);
    }
}

$.load = {
    loadCount: 0,
    show: function(options,callback){
        if(!this.loadCount){
            this.loadCount++;
            var l = new Load(options,callback);
            return l;
        }else{
            console.log('存在');
            return $;
        }
        
    },
    hide: function(callback){
        var load = document.querySelector('#load');
        load.parentNode.removeChild(load);
        callback ? callback.call(this) : function(){};
        return $;
    }
}