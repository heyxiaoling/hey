/**
 * Created by zhuyu on 2016/10/10.
 */
var mgui = (function(document, undefined) {

    /**
     * 兼容方法补齐，用于检查并补齐浏览器缺失方法
     * @param {type} undefined
     * @returns {undefined}
     */
    if (String.prototype.trim === undefined) { // fix for iOS 3.2 & android
        String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, '');
        };
    }
    Object.setPrototypeOf = Object.setPrototypeOf || function(obj, proto) {
        obj['__proto__'] = proto;
        return obj;
    };
    // 为body添加ontouchstart 解决active 伪类无效的问题
    window.document.body.setAttribute("ontouchstart","");
    //// 重写所有a标签跳转
    //$('body').on('click','a',function(e){
    //    if( !this.href || this.href=="" || this.getAttribute("href") == "#" ) {
    //        return false;
    //    }
    //    $.jumpTo(this.getAttribute("href"));
    //    return false;
    //});

    var readyRE = /complete|loaded|interactive/;
    var idSelectorRE = /^#([\w-]+)$/;
    var classSelectorRE = /^\.([\w-]+)$/;
    var tagSelectorRE = /^[\w-]+$/;
    var translateRE = /translate(?:3d)?\((.+?)\)/;
    var translateMatrixRE = /matrix(3d)?\((.+?)\)/;

    var $ = function(selector, context) {
        context = context || document;
        if (!selector)
            return wrap();
        if (typeof selector === 'object')
            if ($.isArrayLike(selector)) {
                return wrap($.slice.call(selector), null);
            } else {
                return wrap([selector], null);
            }
        if (typeof selector === 'function')
            return $.ready(selector);
        if (typeof selector === 'string') {
            try {
                selector = selector.trim();
                if (idSelectorRE.test(selector)) {
                    var found = document.getElementById(RegExp.$1);
                    return wrap(found ? [found] : []);
                }
                return wrap($.qsa(selector, context), selector);
            } catch (e) {}
        }
        return wrap();
    };

    var wrap = function(dom, selector) {
        dom = dom || [];
        Object.setPrototypeOf(dom, $.fn);
        dom.selector = selector || '';
        return dom;
    };

    $.uuid = 0;

    $.data = {};
    /**
     * extend(simple)
     * @param {type} target
     * @param {type} source
     * @param {type} deep
     * @returns {unresolved}
     */
    $.extend = function() { //from jquery2
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        if (typeof target === "boolean") {
            deep = target;

            target = arguments[i] || {};
            i++;
        }

        if (typeof target !== "object" && !$.isFunction(target)) {
            target = {};
        }

        if (i === length) {
            target = this;
            i--;
        }

        for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    if (target === copy) {
                        continue;
                    }

                    if (deep && copy && ($.isPlainObject(copy) || (copyIsArray = $.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && $.isArray(src) ? src : [];

                        } else {
                            clone = src && $.isPlainObject(src) ? src : {};
                        }

                        target[name] = $.extend(deep, clone, copy);

                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        return target;
    };
    /**
     * 基础方法
     */
    $.noop = function() {};

    $.slice = [].slice;

    $.filter = [].filter;

    $.type = function(obj) {
        return obj == null ? String(obj) : class2type[{}.toString.call(obj)] || "object";
    };

    $.isArray = Array.isArray ||
        function(object) {
            return object instanceof Array;
        };

    $.isArrayLike = function(obj) {
        var length = !!obj && "length" in obj && obj.length;
        var type = $.type(obj);
        if (type === "function" || $.isWindow(obj)) {
            return false;
        }
        return type === "array" || length === 0 ||
            typeof length === "number" && length > 0 && (length - 1) in obj;
    };

    $.isWindow = function(obj) {
        return obj != null && obj === obj.window;
    };

    $.isObject = function(obj) {
        return $.type(obj) === "object";
    };

    $.isString = function(obj) {
        return Object.prototype.toString.call(obj) === "[object String]"
    };

    $.isPlainObject = function(obj) {
        return $.isObject(obj) && !$.isWindow(obj) && Object.getPrototypeOf(obj) === Object.prototype;
    };

    $.isEmptyObject = function(o) {
        for (var p in o) {
            if (p !== undefined) {
                return false;
            }
        }
        return true;
    };

    $.isFunction = function(value) {
        return $.type(value) === "function";
    };
    /**
     * 选择器补充方法
     * @param {type} selector
     * @param {type} context
     * @returns {Array}
     */
    $.qsa = function(selector, context) {
        context = context || document;
        return $.slice.call(classSelectorRE.test(selector) ? context.getElementsByClassName(RegExp.$1) : tagSelectorRE.test(selector) ? context.getElementsByTagName(selector) : context.querySelectorAll(selector));
    };

    /**
     * 将 fn 缓存一段时间后, 再被调用执行
     * 此方法为了避免在 ms 段时间内, 执行 fn 多次. 常用于 resize , scroll , mousemove 等连续性事件中;
     * 当 ms 设置为 -1, 表示立即执行 fn, 即和直接调用 fn 一样;
     * 调用返回函数的 stop 停止最后一次的 buffer 效果
     * @param {Object} fn
     * @param {Object} ms
     * @param {Object} context
     */
    $.buffer = function(fn, ms, context) {
        var timer;
        var lastStart = 0;
        var lastEnd = 0;
        var ms = ms || 150;

        function run() {
            if (timer) {
                timer.cancel();
                timer = 0;
            }
            lastStart = $.now();
            fn.apply(context || this, arguments);
            lastEnd = $.now();
        }

        return $.extend(function() {
            if (
                (!lastStart) || // 从未运行过
                (lastEnd >= lastStart && $.now() - lastEnd > ms) || // 上次运行成功后已经超过ms毫秒
                (lastEnd < lastStart && $.now() - lastStart > ms * 8) // 上次运行或未完成，后8*ms毫秒
            ) {
                run();
            } else {
                if (timer) {
                    timer.cancel();
                }
                timer = $.later(run, ms, null, arguments);
            }
        }, {
            stop: function() {
                if (timer) {
                    timer.cancel();
                    timer = 0;
                }
            }
        });
    };
    /**
     * each
     * @param {type} elements
     * @param {type} callback
     * @returns {_L8.$}
     */
    $.each = function(elements, callback, hasOwnProperty) {
        if (!elements) {
            return this;
        }
        if (typeof elements.length === 'number') {
            [].every.call(elements, function(el, idx) {
                return callback.call(el, idx, el) !== false;
            });
        } else {
            for (var key in elements) {
                if (hasOwnProperty) {
                    if (elements.hasOwnProperty(key)) {
                        if (callback.call(elements[key], key, elements[key]) === false) return elements;
                    }
                } else {
                    if (callback.call(elements[key], key, elements[key]) === false) return elements;
                }
            }
        }
        return this;
    };
    $.focus = function(element) {
        if ($.os.ios) {
            setTimeout(function() {
                element.focus();
            }, 10);
        } else {
            element.focus();
        }
    };
    /**
     * trigger event
     * @param {type} element
     * @param {type} eventType
     * @param {type} eventData
     * @returns {_L8.$}
     */
    $.trigger = function(element, eventType, eventData) {
        element.dispatchEvent(new CustomEvent(eventType, {
            detail: eventData,
            bubbles: true,
            cancelable: true
        }));
        return this;
    };
    /**
     * setTimeout封装
     * @param {Object} fn
     * @param {Object} when
     * @param {Object} context
     * @param {Object} data
     */
    $.later = function(fn, when, context, data) {
        when = when || 0;
        var m = fn;
        var d = data;
        var f;
        var r;

        if (typeof fn === 'string') {
            m = context[fn];
        }

        f = function() {
            m.apply(context, $.isArray(d) ? d : [d]);
        };

        r = setTimeout(f, when);

        return {
            id: r,
            cancel: function() {
                clearTimeout(r);
            }
        };
    };
    $.now = Date.now || function() {
            return +new Date();
        };
    var class2type = {};
    $.each(['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error'], function(i, name) {
        class2type["[object " + name + "]"] = name.toLowerCase();
    });
    if (window.JSON) {
        $.parseJSON = JSON.parse;
    }
    /**
     * $.fn
     */
    $.fn = {
        each: function(callback) {
            [].every.call(this, function(el, idx) {
                return callback.call(el, idx, el) !== false;
            });
            return this;
        }
    };

    /**
     * dom操作基本方法
     */
    $.fn.eq = function (i) {
        if(!this[i]){
            return undefined;
        } else {
            return $(this[i]);
        }
    };
    
    $.arrIndexOf = function(arr,v){
        for(var i=0; i<arr.length;i++){
            if(arr[i]==v){
                return i;
            }
        }
        return -1;
    }

    $.fn.addClass = function(className){
        this.each(function(i,el){
            if(el.className ==''){
                el.className = className;
            }else{
                var arrClassName = el.className.split(" ");
                var i = $.arrIndexOf(arrClassName,className);
                if( i ==-1){
                    el.className +=' ' + className;
                }
            }
        });
        return this;
    }


    $.fn.removeClass = function(className){
        this.each(function(i,el){
            if(el.className !=''){
                var arrClassName = el.className.split(' ');
                var i = $.arrIndexOf(arrClassName,className);
                if(i != -1){
                    arrClassName.splice(i,1);
                    el.className=arrClassName.join(' ');
                }
            }
        });
        return this;
    }

    $.fn.hasClass = function(className){
        this.each(function(i,el){
            if (el.classList)
                return el.classList.contains(className);
            else
                return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
        });
        return this;
        
    }

    $.fn.toggleClass = function(className){
        this.each(function(i,el){
            if(el.classList){
                el.classList.toggle(className);
            }else{
                var classes = el.className.split(' ');
                var existingIndex = classes.indexOf(className);

                if (existingIndex >= 0)
                    classes.splice(existingIndex, 1);
                else
                    classes.push(className);

                el.className = classes.join(' ');
            }
        });
        return this;
    }
    return $;
})(document);

/**
 * ajax
 * @param {type} $
 * @returns {undefined}
 */
(function($){

    var isString = function(obj){ return typeof obj == 'string'},
        specialEvents={},
        eventMethods = {
            preventDefault: 'isDefaultPrevented',
            stopImmediatePropagation: 'isImmediatePropagationStopped',
            stopPropagation: 'isPropagationStopped'
        },
        returnFalse = function(){return false};

    $.Event = function(type, props) {
        if (!isString(type)) props = type, type = props.type
        var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
        if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
        event.initEvent(type, bubbles, true)
        return compatible(event)
    };

    $.fn.trigger = function(event, args){
        event = (isString(event) || $.isPlainObject(event)) ? $.Event(event) : compatible(event)
        event._args = args
        return this.each(function(){
            // handle focus(), blur() by calling them directly
            if (event.type in focus && typeof this[event.type] == "function") this[event.type]()
            // items in the collection might not be DOM elements
            else if ('dispatchEvent' in this) this.dispatchEvent(event)
            else $(this).triggerHandler(event, args)
        })
    };

    function compatible(event, source) {
        if (source || !event.isDefaultPrevented) {
            source || (source = event)

            $.each(eventMethods, function(name, predicate) {
                var sourceMethod = source[name]
                event[name] = function(){
                    this[predicate] = returnTrue
                    return sourceMethod && sourceMethod.apply(source, arguments)
                }
                event[predicate] = returnFalse
            })

            event.timeStamp || (event.timeStamp = Date.now())

            if (source.defaultPrevented !== undefined ? source.defaultPrevented :
                    'returnValue' in source ? source.returnValue === false :
                    source.getPreventDefault && source.getPreventDefault())
                event.isDefaultPrevented = returnTrue
        }
        return event
    }

    var jsonpID = +new Date(),
        document = window.document,
        key,
        name,
        rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        scriptTypeRE = /^(?:text|application)\/javascript/i,
        xmlTypeRE = /^(?:text|application)\/xml/i,
        jsonType = 'application/json',
        htmlType = 'text/html',
        blankRE = /^\s*$/,
        originAnchor = document.createElement('a')

    originAnchor.href = window.location.href

    // trigger a custom event and return false if it was cancelled
    function triggerAndReturn(context, eventName, data) {
        var event = $.Event(eventName)
        $(context).trigger(event, data)
        return !event.isDefaultPrevented()
    }

    // trigger an Ajax "global" event
    function triggerGlobal(settings, context, eventName, data) {
        if (settings.global) return triggerAndReturn(context || document, eventName, data)
    }

    // Number of active Ajax requests
    $.active = 0

    function ajaxStart(settings) {
        if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart')
    }
    function ajaxStop(settings) {
        if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop')
    }

    // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
    function ajaxBeforeSend(xhr, settings) {
        var context = settings.context
        if (settings.beforeSend.call(context, xhr, settings) === false ||
            triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
            return false

        triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])
    }
    function ajaxSuccess(data, xhr, settings, deferred) {
        var context = settings.context, status = 'success'
        settings.success.call(context, data, status, xhr)
        if (deferred) deferred.resolveWith(context, [data, status, xhr])
        triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
        ajaxComplete(status, xhr, settings)
    }
    // type: "timeout", "error", "abort", "parsererror"
    function ajaxError(error, type, xhr, settings, deferred) {
        var context = settings.context
        settings.error.call(context, xhr, type, error)
        if (deferred) deferred.rejectWith(context, [xhr, type, error])
        triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error || type])
        ajaxComplete(type, xhr, settings)
    }
    // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
    function ajaxComplete(status, xhr, settings) {
        var context = settings.context
        settings.complete.call(context, xhr, status)
        triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
        ajaxStop(settings)
    }

    function ajaxDataFilter(data, type, settings) {
        if (settings.dataFilter == empty) return data
        var context = settings.context
        return settings.dataFilter.call(context, data, type)
    }

    // Empty function, used as default callback
    function empty() {}

    $.ajaxJSONP = function(options, deferred){
        if (!('type' in options)) return $.ajax(options)

        var _callbackName = options.jsonpCallback,
            callbackName = ($.isFunction(_callbackName) ?
                    _callbackName() : _callbackName) || ('Zepto' + (jsonpID++)),
            script = document.createElement('script'),
            originalCallback = window[callbackName],
            responseData,
            abort = function(errorType) {
                $(script).triggerHandler('error', errorType || 'abort')
            },
            xhr = { abort: abort }, abortTimeout

        if (deferred) deferred.promise(xhr)

        $(script).on('load error', function(e, errorType){
            clearTimeout(abortTimeout)
            $(script).off().remove()

            if (e.type == 'error' || !responseData) {
                ajaxError(null, errorType || 'error', xhr, options, deferred)
            } else {
                ajaxSuccess(responseData[0], xhr, options, deferred)
            }

            window[callbackName] = originalCallback
            if (responseData && $.isFunction(originalCallback))
                originalCallback(responseData[0])

            originalCallback = responseData = undefined
        })

        if (ajaxBeforeSend(xhr, options) === false) {
            abort('abort')
            return xhr
        }

        window[callbackName] = function(){
            responseData = arguments
        }

        script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName)
        document.head.appendChild(script)

        if (options.timeout > 0) abortTimeout = setTimeout(function(){
            abort('timeout')
        }, options.timeout)

        return xhr
    }

    $.ajaxSettings = {
        // Default type of request
        type: 'GET',
        // Callback that is executed before request
        beforeSend: empty,
        // Callback that is executed if the request succeeds
        success: empty,
        // Callback that is executed the the server drops error
        error: empty,
        // Callback that is executed on request complete (both: error and success)
        complete: empty,
        // The context for the callbacks
        context: null,
        // Whether to trigger "global" Ajax events
        global: true,
        // Transport
        xhr: function () {
            return new window.XMLHttpRequest()
        },
        // MIME types mapping
        // IIS returns Javascript as "application/x-javascript"
        accepts: {
            script: 'text/javascript, application/javascript, application/x-javascript',
            json:   jsonType,
            xml:    'application/xml, text/xml',
            html:   htmlType,
            text:   'text/plain'
        },
        // Whether the request is to another domain
        crossDomain: false,
        // Default timeout
        timeout: 0,
        // Whether data should be serialized to string
        processData: true,
        // Whether the browser should be allowed to cache GET responses
        cache: true,
        //Used to handle the raw response data of XMLHttpRequest.
        //This is a pre-filtering function to sanitize the response.
        //The sanitized response should be returned
        dataFilter: empty
    }

    function mimeToDataType(mime) {
        if (mime) mime = mime.split(';', 2)[0]
        return mime && ( mime == htmlType ? 'html' :
                mime == jsonType ? 'json' :
                    scriptTypeRE.test(mime) ? 'script' :
                    xmlTypeRE.test(mime) && 'xml' ) || 'text'
    }

    function appendQuery(url, query) {
        if (query == '') return url
        return (url + '&' + query).replace(/[&?]{1,2}/, '?')
    }

    // serialize payload and append it to the URL for GET requests
    function serializeData(options) {
        if (options.processData && options.data && $.type(options.data) != "string")
            options.data = $.param(options.data, options.traditional)
        if (options.data && (!options.type || options.type.toUpperCase() == 'GET' || 'jsonp' == options.dataType))
            options.url = appendQuery(options.url, options.data), options.data = undefined
    }

    $.ajax = function(options){
        var settings = $.extend({}, options || {}),
            deferred = $.Deferred && $.Deferred(),
            urlAnchor, hashIndex
        for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]

        ajaxStart(settings)

        if (!settings.crossDomain) {
            urlAnchor = document.createElement('a')
            urlAnchor.href = settings.url
            // cleans up URL for .href (IE only), see https://github.com/madrobby/zepto/pull/1049
            urlAnchor.href = urlAnchor.href
            settings.crossDomain = (originAnchor.protocol + '//' + originAnchor.host) !== (urlAnchor.protocol + '//' + urlAnchor.host)
        }

        if (!settings.url) settings.url = window.location.toString()
        if ((hashIndex = settings.url.indexOf('#')) > -1) settings.url = settings.url.slice(0, hashIndex)
        serializeData(settings)

        var dataType = settings.dataType, hasPlaceholder = /\?.+=\?/.test(settings.url)
        if (hasPlaceholder) dataType = 'jsonp'

        if (settings.cache === false || (
                (!options || options.cache !== true) &&
                ('script' == dataType || 'jsonp' == dataType)
            ))
            settings.url = appendQuery(settings.url, '_=' + Date.now())

        if ('jsonp' == dataType) {
            if (!hasPlaceholder)
                settings.url = appendQuery(settings.url,
                    settings.jsonp ? (settings.jsonp + '=?') : settings.jsonp === false ? '' : 'callback=?')
            return $.ajaxJSONP(settings, deferred)
        }

        var mime = settings.accepts[dataType],
            headers = { },
            setHeader = function(name, value) { headers[name.toLowerCase()] = [name, value] },
            protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
            xhr = settings.xhr(),
            nativeSetHeader = xhr.setRequestHeader,
            abortTimeout

        if (deferred) deferred.promise(xhr)

        if (!settings.crossDomain) setHeader('X-Requested-With', 'XMLHttpRequest')
        setHeader('Accept', mime || '*/*')
        if (mime = settings.mimeType || mime) {
            if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
            xhr.overrideMimeType && xhr.overrideMimeType(mime)
        }
        if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET'))
            setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded')

        if (settings.headers) for (name in settings.headers) setHeader(name, settings.headers[name])
        xhr.setRequestHeader = setHeader

        xhr.onreadystatechange = function(){
            if (xhr.readyState == 4) {
                xhr.onreadystatechange = empty
                clearTimeout(abortTimeout)
                var result, error = false
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
                    dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'))

                    if (xhr.responseType == 'arraybuffer' || xhr.responseType == 'blob')
                        result = xhr.response
                    else {
                        result = xhr.responseText

                        try {
                            // http://perfectionkills.com/global-eval-what-are-the-options/
                            // sanitize response accordingly if data filter callback provided
                            result = ajaxDataFilter(result, dataType, settings)
                            if (dataType == 'script')    (1,eval)(result)
                            else if (dataType == 'xml')  result = xhr.responseXML
                            else if (dataType == 'json') result = blankRE.test(result) ? null : $.parseJSON(result)
                        } catch (e) { error = e }

                        if (error) return ajaxError(error, 'parsererror', xhr, settings, deferred)
                    }

                    ajaxSuccess(result, xhr, settings, deferred)
                } else {
                    ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings, deferred)
                }
            }
        }

        if (ajaxBeforeSend(xhr, settings) === false) {
            xhr.abort()
            ajaxError(null, 'abort', xhr, settings, deferred)
            return xhr
        }

        var async = 'async' in settings ? settings.async : true
        xhr.open(settings.type, settings.url, async, settings.username, settings.password)

        if (settings.xhrFields) for (name in settings.xhrFields) xhr[name] = settings.xhrFields[name]

        for (name in headers) nativeSetHeader.apply(xhr, headers[name])

        if (settings.timeout > 0) abortTimeout = setTimeout(function(){
            xhr.onreadystatechange = empty
            xhr.abort()
            ajaxError(null, 'timeout', xhr, settings, deferred)
        }, settings.timeout)

        // avoid sending empty string (#319)
        xhr.send(settings.data ? settings.data : null)
        return xhr
    }

    // handle optional data/success arguments
    function parseArguments(url, data, success, dataType) {
        if ($.isFunction(data)) dataType = success, success = data, data = undefined
        if (!$.isFunction(success)) dataType = success, success = undefined
        return {
            url: url
            , data: data
            , success: success
            , dataType: dataType
        }
    }

    $.get = function(/* url, data, success, dataType */){
        return $.ajax(parseArguments.apply(null, arguments))
    }

    $.post = function(/* url, data, success, dataType */){
        var options = parseArguments.apply(null, arguments)
        options.type = 'POST'
        return $.ajax(options)
    }

    $.getJSON = function(/* url, data, success */){
        var options = parseArguments.apply(null, arguments)
        options.dataType = 'json'
        return $.ajax(options)
    }

    $.fn.load = function(url, data, success){
        if (!this.length) return this
        var self = this, parts = url.split(/\s/), selector,
            options = parseArguments(url, data, success),
            callback = options.success
        if (parts.length > 1) options.url = parts[0], selector = parts[1]
        options.success = function(response){
            self.html(selector ?
                $('<div>').html(response.replace(rscript, "")).find(selector)
                : response)
            callback && callback.apply(self, arguments)
        }
        $.ajax(options)
        return this
    }

    var escape = encodeURIComponent

    function serialize(params, obj, traditional, scope){
        var type, array = $.isArray(obj), hash = $.isPlainObject(obj)
        $.each(obj, function(key, value) {
            type = $.type(value)
            if (scope) key = traditional ? scope :
            scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']'
            // handle data in serializeArray() format
            if (!scope && array) params.add(value.name, value.value)
            // recurse into nested objects
            else if (type == "array" || (!traditional && type == "object"))
                serialize(params, value, traditional, key)
            else params.add(key, value)
        })
    }

    $.param = function(obj, traditional){
        var params = []
        params.add = function(key, value) {
            if ($.isFunction(value)) value = value()
            if (value == null) value = ""
            this.push(escape(key) + '=' + escape(value))
        }
        serialize(params, obj, traditional)
        return params.join('&').replace(/%20/g, '+')
    }
})(mgui);


/**
 * on off 事件处理
 * @param {type} $
 * @returns {undefined}
 */
(function($) {
    if ('ontouchstart' in window) {
        $.isTouchable = true;
        $.EVENT_START = 'touchstart';
        $.EVENT_MOVE = 'touchmove';
        $.EVENT_END = 'touchend';
    } else {
        $.isTouchable = false;
        $.EVENT_START = 'mousedown';
        $.EVENT_MOVE = 'mousemove';
        $.EVENT_END = 'mouseup';
    }
    $.EVENT_CANCEL = 'touchcancel';
    $.EVENT_CLICK = 'click';

    var _mid = 1;
    var delegates = {};
    //需要wrap的函数
    var eventMethods = {
        preventDefault: 'isDefaultPrevented',
        stopImmediatePropagation: 'isImmediatePropagationStopped',
        stopPropagation: 'isPropagationStopped'
    };
    //默认true返回函数
    var returnTrue = function() {
        return true
    };
    //默认false返回函数
    var returnFalse = function() {
        return false
    };
    //wrap浏览器事件
    var compatible = function(event, target) {
        if (!event.detail) {
            event.detail = {
                currentTarget: target
            };
        } else {
            event.detail.currentTarget = target;
        }
        $.each(eventMethods, function(name, predicate) {
            var sourceMethod = event[name];
            event[name] = function() {
                this[predicate] = returnTrue;
                return sourceMethod && sourceMethod.apply(event, arguments)
            }
            event[predicate] = returnFalse;
        }, true);
        return event;
    };
    //简单的wrap对象_mid
    var mid = function(obj) {
        return obj && (obj._mid || (obj._mid = _mid++));
    };
    //事件委托对象绑定的事件回调列表
    var delegateFns = {};
    //返回事件委托的wrap事件回调
    var delegateFn = function(element, event, selector, callback) {
        return function(e) {
            //same event
            var callbackObjs = delegates[element._mid][event];
            var handlerQueue = [];
            var target = e.target;
            var selectorAlls = {};
            for (; target && target !== document; target = target.parentNode) {
                if (target === element) {
                    break;
                }
                if (~['click', 'tap', 'doubletap', 'longtap', 'hold'].indexOf(event) && (target.disabled || target.classList.contains('mgui-disabled'))) {
                    break;
                }
                var matches = {};
                $.each(callbackObjs, function(selector, callbacks) { //same selector
                    selectorAlls[selector] || (selectorAlls[selector] = $.qsa(selector, element));
                    if (selectorAlls[selector] && ~(selectorAlls[selector]).indexOf(target)) {
                        if (!matches[selector]) {
                            matches[selector] = callbacks;
                        }
                    }
                }, true);
                if (!$.isEmptyObject(matches)) {
                    handlerQueue.push({
                        element: target,
                        handlers: matches
                    });
                }
            }
            selectorAlls = null;
            e = compatible(e); //compatible event
            $.each(handlerQueue, function(index, handler) {
                target = handler.element;
                var tagName = target.tagName;
                if (event === 'tap' && (tagName !== 'INPUT' && tagName !== 'TEXTAREA' && tagName !== 'SELECT')) {
                    e.preventDefault();
                    e.detail && e.detail.gesture && e.detail.gesture.preventDefault();
                }
                $.each(handler.handlers, function(index, handler) {
                    $.each(handler, function(index, callback) {
                        if (callback.call(target, e) === false) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    }, true);
                }, true)
                if (e.isPropagationStopped()) {
                    return false;
                }
            }, true);
        };
    };
    var findDelegateFn = function(element, event) {
        var delegateCallbacks = delegateFns[mid(element)];
        var result = [];
        if (delegateCallbacks) {
            result = [];
            if (event) {
                var filterFn = function(fn) {
                    return fn.type === event;
                }
                return delegateCallbacks.filter(filterFn);
            } else {
                result = delegateCallbacks;
            }
        }
        return result;
    };
    var preventDefaultException = /^(INPUT|TEXTAREA|BUTTON|SELECT)$/;
    /**
     * delegate events
     * @param {type} event
     * @param {type} selector
     * @param {type} callback
     * @returns {undefined}
     */
    $.fn.on = function(event, selector, callback) { //仅支持简单的事件委托,主要是tap事件使用，类似mouse,focus之类暂不封装支持
        // TODO 对未传入选择器做处理
        if($.isFunction(selector)){
            callback = selector;
            selector = null;
        }
        return this.each(function() {
            var element = this;
            mid(element);
            mid(callback);
            var isAddEventListener = false;
            var delegateEvents = delegates[element._mid] || (delegates[element._mid] = {});
            var delegateCallbackObjs = delegateEvents[event] || ((delegateEvents[event] = {}));
            if ($.isEmptyObject(delegateCallbackObjs)) {
                isAddEventListener = true;
            }
            var delegateCallbacks = delegateCallbackObjs[selector] || (delegateCallbackObjs[selector] = []);
            delegateCallbacks.push(callback);
            if (isAddEventListener) {
                var delegateFnArray = delegateFns[mid(element)];
                if (!delegateFnArray) {
                    delegateFnArray = [];
                }
                var delegateCallback = delegateFn(element, event, selector, callback);
                delegateFnArray.push(delegateCallback);
                delegateCallback.i = delegateFnArray.length - 1;
                delegateCallback.type = event;
                delegateFns[mid(element)] = delegateFnArray;
                element.addEventListener(event, delegateCallback);
                if (event === 'tap') { //TODO 需要找个更好的解决方案
                    element.addEventListener('click', function(e) {
                        if (e.target) {
                            var tagName = e.target.tagName;
                            if (!preventDefaultException.test(tagName)) {
                                if (tagName === 'A') {
                                    var href = e.target.href;
                                    if (!(href && ~href.indexOf('tel:'))) {
                                        e.preventDefault();
                                    }
                                } else {
                                    e.preventDefault();
                                }
                            }
                        }
                    });
                }
            }
        });
    };
    $.fn.off = function(event, selector, callback) {
        return this.each(function() {
            var _mid = mid(this);
            if (!event) { //mgui(selector).off();
                delegates[_mid] && delete delegates[_mid];
            } else if (!selector) { //mgui(selector).off(event);
                delegates[_mid] && delete delegates[_mid][event];
            } else if (!callback) { //mgui(selector).off(event,selector);
                delegates[_mid] && delegates[_mid][event] && delete delegates[_mid][event][selector];
            } else { //mgui(selector).off(event,selector,callback);
                var delegateCallbacks = delegates[_mid] && delegates[_mid][event] && delegates[_mid][event][selector];
                $.each(delegateCallbacks, function(index, delegateCallback) {
                    if (mid(delegateCallback) === mid(callback)) {
                        delegateCallbacks.splice(index, 1);
                        return false;
                    }
                }, true);
            }
            if (delegates[_mid]) {
                //如果off掉了所有当前element的指定的event事件，则remove掉当前element的delegate回调
                if ((!delegates[_mid][event] || $.isEmptyObject(delegates[_mid][event]))) {
                    findDelegateFn(this, event).forEach(function(fn) {
                        this.removeEventListener(fn.type, fn);
                        delete delegateFns[_mid][fn.i];
                    }.bind(this));
                }
            } else {
                //如果delegates[_mid]已不存在，删除所有
                findDelegateFn(this).forEach(function(fn) {
                    this.removeEventListener(fn.type, fn);
                    delete delegateFns[_mid][fn.i];
                }.bind(this));
            }
        });

    };
})(mgui);

/**
 * 打开，关闭，回退页面方法封装
 * @param {type} $
 * @returns {undefined}
 */
(function($) {
    // 判断是否为iframe加载
    var _isChildPage = (self.frameElement && self.frameElement.tagName == "IFRAME")?true:false;

    $.queryToObj = function(queryStr) {
        queryStr = decodeURIComponent(queryStr);
        var queryArr = queryStr.match(new RegExp("[^\?\&]+=[^\?\&]+","g"));
        var resObj = {};
        if (!queryArr){
            return resObj;
        }
        for(var i=0; i<queryArr.length; i++){
            var tmpArr = queryArr[i].split('=');
            tmpArr[0] = tmpArr[0].replace(/^(&|\?)(.)/g, '$2');
            if( tmpArr[1].length>1 ){ // length 大于1 表示=号后存在参数
                if(!resObj[tmpArr[0]]){
                    resObj[tmpArr[0]] = tmpArr[1];
                } else if( $.isArray(resObj[tmpArr[0]]) ) {
                    resObj[tmpArr[0]].push(tmpArr[1]);
                } else {
                    resObj[tmpArr[0]] = [ resObj[tmpArr[0]] ];
                    resObj[tmpArr[0]].push(tmpArr[1]);
                }
            }
        }
        return resObj;
    };

    $.objToQuery = function(obj){
        var tempArr = [];
        for(var key in obj){
            if( $.isArray(obj[key]) ) {
                for(var i=0;i<obj[key].length;i++) {
                    tempArr.push(key+'='+obj[key][i]);
                }
            } else {
                tempArr.push(key+'='+obj[key]);
            }
        }
        return tempArr.join('&');
    };
    /**
     * 表单序列化操作
     */
    $.fn.serialize = function() {
        var tmpArr = [];
        $(this[0]).each(function(index,domEle){
            if(domEle.name){
                if(domEle.value){
                    if (domEle.type.toLowerCase()=='radio'||domEle.type.toLowerCase()=='checkbox') {
                        if(domEle.checked){
                            tmpArr.push(domEle.name+"="+domEle.value);
                        }
                    } else {
                        tmpArr.push(domEle.name+"="+domEle.value);
                    }
                } else if (domEle.type.toLowerCase()=='radio'||domEle.type.toLowerCase()=='checkbox') {
                    if(domEle.checked){
                        tmpArr.push(domEle.name+"=on");
                    }
                }
            }
        });
        return $.queryToObj(tmpArr.join("&"));
    };
    /**
     * 表单设置
     * @param inData 可以为json对象，或queryString
     */
    $.fn.setForm = function(inData) {
        var dataObj = {};
        if($.isObject(inData)){
            dataObj = inData;
        } else if($.isString(inData)) {
            dataObj = $.queryToObj(inData);
        } else {
            return {};
        }
        $(this[0]).each(function(index,domEle){
            if(dataObj[domEle.name]){
                if(domEle.tagName.toLowerCase() == "input") {
                    if(domEle.type.toLowerCase()=='radio'||domEle.type.toLowerCase()=='checkbox') {
                        if($.isString(dataObj[domEle.name])){
                            if(!domEle.value) {
                                domEle.checked = true;
                            } else if (domEle.value == dataObj[domEle.name]){
                                domEle.checked = true;
                            }
                        } else if ($.isArray(dataObj[domEle.name])) {
                            for(var i=0;i<dataObj[domEle.name].length;i++){
                                if(dataObj[domEle.name][i]==domEle.value) {
                                    domEle.checked = true;
                                }
                            }
                        }
                    } else {
                        domEle.value = dataObj[domEle.name];
                    }
                } else if (domEle.tagName.toLowerCase() == "select") {
                    $(domEle).each(function(i,option){
                        if(dataObj[domEle.name] == option.value){
                            option.selected = true;
                        } else {
                            option.removeAttribute("selected");
                        }
                    });
                }
            }
        });
    };
    /**
     * arguments[0] url
     * arguments[1] data
     */
    $.jumpTo = function() {
        if(_isChildPage){
            window.parent.jumpTo({
                url:arguments[0],
                data:arguments[1]
        });
        } else {
            window.location.href = arguments[0];
        }
    };
    $.backTo = function() {
        if(_isChildPage){
            window.parent.backTo();
        } else {
            window.history.back();
        }
    };
    // 页面刷新，或收到index消息通知
    $.onRecvData = function(data){
        // TODO 在页面中重写以获取参数
    };

    // 返回按钮绑定回退方法
    $('.mg-bar-nav').on('click', '#header-back', function(e) {
        $.backTo();
    });
    // 标题设置
    $.setTitle = function(html){
        $('.mg-bar-nav #title')[0].innerHTML = html;
    };
})(mgui);

module.exports = mgui;