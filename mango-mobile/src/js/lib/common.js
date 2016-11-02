/**
 * Created by zhuyu on 2016/10/10.
 *
 */
(function($){
    /**
     * 克隆对象 用于避免对象数据操作是造成的数据污�
     * @param obj
     * @returns {*}
     */
    $.clone = function clone(obj){
        var o;
        switch(typeof obj){
            case 'undefined': break;
            case 'string'   : o = obj + '';break;
            case 'number'   : o = obj - 0;break;
            case 'boolean'  : o = obj;break;
            case 'object'   :
                if(obj === null){
                    o = null;
                }else{
                    if(obj instanceof Array){
                        o = [];
                        for(var i = 0, len = obj.length; i < len; i++){
                            o.push(clone(obj[i]));
                        }
                    }else{
                        o = {};
                        for(var k in obj){
                            o[k] = clone(obj[k]);
                        }
                    }
                }
                break;
            default:
                o = obj;break;
        }
        return o;
    };
    /**
     * 屏幕遮罩 锁屏方法
     * @type {{_muskDom: null, show: mgui.mask.show, hide: mgui.mask.hide}}
     */
    $.mask = {
        _muskDom:null,
        _retainCount:0,
        _closeFunc:[],
        _clickFunc:[],
        show : function() {
            this._retainCount++;
            if(this._muskDom) {
                return;
            }
            var self = this;
            this._muskDom = document.createElement("div");
            this._muskDom.className = "mg-mask";
            document.body.appendChild(this._muskDom);
            this._muskDom.addEventListener('click',function(e){
                // 遍历调用点击方法
                for(var i=0; i<self._clickFunc.length;i++){
                    self._clickFunc[i](e);
                }
            })
        },
        hide : function() {
            this._retainCount--;
            if(this._muskDom && this._retainCount<=0){
                this._retainCount = 0;
                this._muskDom.parentNode.removeChild(this._muskDom);
                // 遍历调用关闭方法
                for(var i=0; i<this._closeFunc.length;i++){
                    this._closeFunc[i]();
                }
                this._muskDom = null;
            }
        },
        onClose: function(callback) {
            this._closeFunc.push(callback);
        },
        onClick: function(callback) {
            this._clickFunc.push(callback);
        }
    };
    /**
     * loading方法
     * @type {{show: mgui.loading.show}}
     */
    $.loading = {
        _domLoading:null,
        _retainCount:0, // 当存在多个并发loading时，根据加载次数关闭
        show: function (inConfig) {
            // 默认参数
            var config = {
                msg:"加载中..",
                className:"mg-loading",
            };
            config = $.extend(config,inConfig);
            this._retainCount++;
            // 检查重复项，如已加载loading 则不予重复显�
            if(this._domLoading){
                this._domLoading.querySelector("span").innerHTML = config.msg;
                return;
            }
            this._domLoading = document.createElement("div");
            this._domLoading.className = config.className;
            this._domLoading.innerHTML ='<div class="container"><i></i><span>'+config.msg+'</span></div>';
            document.body.appendChild(this._domLoading);
        },
        hide: function () {
            this._retainCount--;
            if(this._domLoading && this._retainCount<=0){
                this._domLoading.parentNode.removeChild(this._domLoading);
                this._domLoading = null;
            }
        }
    };
    /**
     * 消息提示方法
     * @param inConfig
     */
    $.tomsg = {
        type:'',
        totalCount: 0,
        realCount: 0,
        count: 0,
        _count: 0,
        autoShowTime: 1000,
        autoClostTime: 2000,
        timer: null,
        timer2: null,
        tips: null,
        show: function(opt){
            var t = this;

            var msg = '<div class="mg-bottom-tips" id="mg-bottom-tips"></div>';
            
            if(t.totalCount === 0){
                document.body.insertAdjacentHTML('beforeEnd', msg);
            }

            t.timer = setTimeout(function(){
                var tip = document.querySelector('#mg-bottom-tips');
                var msgContent = opt&&opt.msg ? '<span class="mg-fade-in">'+opt.msg+'</span>' : '';
                tip.insertAdjacentHTML('beforeEnd', msgContent);
                var l = tip.querySelectorAll('span').length;
                t.hide(l);
            },t.totalCount * t.autoShowTime);

            t.totalCount ++;
        },
        hide: function(){
            var t = this;
            t.count = t.totalCount;
            setTimeout(function(){
                var tip = document.querySelector('#mg-bottom-tips');
                var con = tip.querySelectorAll('span');
                var l = con.length;
                t.count = t.count > l ? t.count : l;
                tip.removeChild(con[0]);
                if(l === 1){
                    t.clear();
                }
            },t.autoClostTime);
        },
        clear: function(){
            var tip = document.querySelector('#mg-bottom-tips');
            document.body.removeChild(tip);
            this.totalCount = 0;
        }
    }

    $.apiCaller = {
        _subData: null,
        call: function (inConfig, func) {
            var config = {
                awaysRunFunc    :false,     // 总是执行func方法 不论成功失败
                showLoading     :false,     // 显示loading
                loadcfg         :{msg:"加载中.."},         // loading 消息配置
                lockScreen      :false,     // 锁屏
                failedmsg       :"",         // 错误提示信息
                succmsg         :"",         // 不存在func 回调方法时显示成功消�
                formid          :"",         // input 容器id
                data            :{},         // 提交数据
                method          :'POST',     // 提交方法
                dataType        :'json',     // 数据类型
                timeout         :0,                     // 超时设置 默认0，无限长
                context         :$('body'),
                headers:{
                    //'Content-Type':'Content-Type:application/json;charset=UTF-8'
                }
            }
            config = $.extend(config,inConfig);
            // debug 打开时需要通过get方法才能获取参数
            if(CONFIG.isDebug()){
                config.method = 'get';
            }
            // 如果存在显示loading
            config.showLoading && $.loading.show(config.loadcfg);
            config.lockScreen && $.mask.show();
            this._subData = config.data;
            if (config.formid) {
                var subForm = $("form[id='"+config.formid+"']");
                for (var i=0; i<subForm[0].length; i++) {
                    if(subForm[0][i].type === "checkbox") {
                        if ( subForm[0][i].checked ){
                            if ( !this._subData[ subForm[0][i].name ] ) {
                                this._subData[ subForm[0][i].name ] = subForm[0][i].value;
                            } else {
                                this._subData[ subForm[0][i].name ] += (","+subForm[0][i].value);
                            }
                        }
                    } else if(subForm[0][i].name) {
                        this._subData[ subForm[0][i].name ] = subForm[0][i].value;
                    }
                }
            }
            var self = this;
            this._subData['apiSource'] = "h5";
            this._subData['uid'] = CONFIG.getInfo('uid');
            this._subData['sid'] = CONFIG.getInfo('sid');
            this._subData['apikey'] = "19958883-A3B8-4B67-93F3-F73F47B20340";
            this._subData['channelId'] = "0193003";

            // 服务器入参标准若为json，需要对数据进行字符串转换处理
            var subData = config.method.toLowerCase()=='post'?JSON.stringify(this._subData):this._subData;
            var ajaxData = {
                type: config.method,
                url: config.api,
                data: subData,
                dataType: config.dataType,
                timeout:  config.timeout,
                context:  config.context,
                success: function (data) {
                    config.lockScreen && $.mask.hide();
                    config.showLoading && $.loading.hide();
                    if (config.dataType!=="json") {
                        func && func(data);
                        return;
                    }
                    if (config.awaysRunFunc || !data || !data.code) {
                        func && func(data);
                        return;
                    }

                    if ( data.code == 1 ) {
                        if ( func ) {
                            func(data);
                        } else if ( config.succmsg ) {
                            $.tomsg.show({msg:config.succmsg});
                        }
                    } else {
                        switch (data.code) {
                            case "2" : // 服务器异�
                                data.message ? $.tomsg.show({msg:data.message}) : $.tomsg.show({msg:config.failedmsg});
                                break;
                            case "3" : // 业务异常
                                data.message ? $.tomsg.show({msg:data.message}) : $.tomsg.show({msg:config.failedmsg});
                                break;
                            default : // 后台输出错误消息
                                $.tomsg.show({msg:'请求失败'});
                        }
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    config.lockScreen && $.mask.hide();
                    config.showLoading && $.loading.hide();
                    switch (XMLHttpRequest.status) {
                        case 0: {
                            console.log('请求超时');
                            break;
                        }
                        case 500: {
                            // 服务器请求错误，请尝试其他参数
                            break;
                        }
                        case 404: {
                            $.tomsg.show({msg:'404:未找到该请求接口'});
                            break;
                        }
                        default: {
                            $.tomsg.show({msg: errorThrown});
                            break;
                        }
                    }
                }
            }
            $.ajax(ajaxData);
        }
    };

    $.cookieUtil = {

        /**
         * 根据opt中设置的值设置cookie
         * 
         * @param {Object} opt 包含cookie信息的对象，选项如下
         *   key {string} 需要设置的名字
         *   value {string} 需要设置的�
         *   maxAge {number} 有效�
         *   domain {string} domain
         *   path {string} path
         *   secure {boolean} secure
         * 
         * @return {string} opt对应的设置cookie的字符串
         */
        setItem: function (opt) {
            var result = [];
            var expireDate = new Date();
            var str;

            if (opt.key) {
                result.push(encodeURIComponent(opt.key) + '=' +
                    encodeURIComponent(opt.value));
                if ('maxAge' in opt) {
                    result.push('max-age=' + opt.maxAge);
                }
                if ('domain' in opt) {
                    result.push('domain=' + opt.domain);
                }
                if ('path' in opt) {
                    result.push('path=' + opt.path);
                }
                if (opt.secure) {
                    result.push('secure');
                }

                str = result.join('; ');
                window.document.cookie = str;

            }
            return str;
        },

        /**
         * 从cookie读取指定key的值，如果key有多个值，返回数组，如果没�
         * 对应key，返回undefined
         * 
         * @param {string} key 需要从cookie获取值得key
         * @return {string|Array|undefined} 根据cookie数据返回不同�
         */
        getItem: function (key) {
            key = encodeURIComponent(key);

            var result;
            var pairs = window.document.cookie.split('; ');
            var i, len, item, value;

            for (i = 0, len = pairs.length; i < len; ++i) {
                item = pairs[i];
                if (item.indexOf(key) === 0) {
                    value = decodeURIComponent(item.slice(item.indexOf('=') + 1));
                    if (typeof result === 'undefined') {
                        result = value;
                    } else if (typeof result === 'string') {
                        result = [result];
                        result.push(value);
                    } else {
                        result.push(value);
                    }
                } // end if
            } // end for
            return result;
        },


        /**
         * 解析cookie返回对象，键值对为cookie存储信息
         * 
         * @return {Object} 包含cookie信息的对�
         */
        getAll: function () {
            var obj = {};
            var i, len, item, key, value, pairs, pos;

            pairs = window.document.cookie.split('; ');
            for (i = 0, len = pairs.length; i < len; ++i) {
                item = pairs[i].split('=');
                key = decodeURIComponent(item[0]);
                value = decodeURIComponent(item[1] ? item[1] : '');
                obj[key] = value;
            }
            return obj;
        },

        /**
         * 清除当前文档能访问的所有cookie
         * 
         */
        clear: function () {
            var pairs = window.document.cookie.split('; ');
            var i, len, item, key;

            for (i = 0, len = pairs.length; i < len; ++i) {
                item = pairs[i];
                key = item.slice(0, item.indexOf('='));
                window.document.cookie = key + '=; max-age=0';
            }
        }
    };

    $.sessionUtil = {
        /**
         * [MgSessionSet sessionStorage set]
         * @param  {[type]} key [key值]
         * @param  {[type]} value  [value值]
         */
        setSession:function(key, value) {
            window.sessionStorage.setItem(key, value);
        },
        /**
         * [MgSessionGet sessionStorage get]
         * @param {[type]} key [key值]
         */
        getSession: function(key) {
            var result = window.sessionStorage.getItem(key);
            if (result == '' || result == "undefined" || result == "null" || result == null || result == undefined) {
                return '';
            };
            return result;
        }
    }

    $.localStorageUtil = {
        /**
         * [MgLocalSet localStorage set]
         * @param {[type]} key   [key值]
         * @param {[type]} value [value值]
         */
        setLocalStorage: function(key, value) {
            window.localStorage.setItem(key, value);
        },
        /**
         * [MgLocalGet localStorage get]
         * @param {[type]} key [key值]
         */
        getLocalStorage: function(key) {
            var result = window.localStorage.getItem(key);
            if (result == '' || result == "undefined" || result == "null" || result == null || result == undefined) {
                return '';
            };
            return result;
        }
    }
    
    $.DateTimeUtil={
    	getWeekday:function(opt){
    		var _thisDate=new Date(opt);
    		return _thisDate.getUTCDay();
    	},
    	getDeltaT:function(opt){
    		var _opt={
    			sDate:'',
    			eDate:''
    		};
    		$.extend(true,_opt, opt);
    		var diff=(new Date(_opt.eDate).getTime()- new Date(_opt.sDate).getTime())/(1000*60*60);
    		var hour= Math.floor(diff);
    		var min= Math.floor((diff-hour)*60);
    		return hour+'h'+min+'m';
    	}
    }

})(mgui)