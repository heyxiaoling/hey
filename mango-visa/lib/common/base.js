/**
 * ajax封装，只用于支持XMLHttpRequest，用于移动端
 * @param  {[type]} obj 对象 url,type,data,dataType,success,error
 * @return {[type]}
 */
export const getDataFromAPI = (obj) => {

	let abj = {},objObj,objStr;
    
    abj.type = obj.type;
    abj.dataType = obj.dataType || "json";

    // 测试地址
    abj.url = 'http://apitest.mangocity.com:8001/apiserver/' + obj.url;
    
    if(typeof obj.data === "string"){
		objObj = JSON.parse(obj.data);
		objStr = JSON.stringify(objObj);
	}

	abj.data = objStr;

	abj.success = obj.success || ((data) => console.log('成功回流' + data));
   
    abj.error = obj.error || ((data) => console.log('失败回流' + data));

    $.ajax(abj);

};

export const orderAjax = (url,obj,fn) =>{
    getDataFromAPI({
        type: "POST",
        url: url,
        data: obj,
        dataType: "json",
        success: function(data){
            if(data.code === "1"){
                fn.call(this,data);
            }else{
                msg({
                   type:"alert",
                   text:  data.message
                });
            }
        }
    });
            
}


/**
 * 保密字符串
 * @param  {[type]} str 字符串
 * @param  {[type]} frontLen 前面保留位数
 * @param  {[type]} endLen 后面保留位数
 * @return {[type]} '熊**先生'
 */
export const secrecyString = (str, frontLen, endLen) => {
	let len = str.length - frontLen - endLen;
	let hideStr = '';
	for (let i = 0; i < len; i++) {
		hideStr += '*';
	}
	return str.substr(0, frontLen) + hideStr + str.substr(str.length - endLen);
};
//焦点轮播图首尾图不显示问题
export const swiperImgShow = (o) => {
	o.find(".swiper-slide-duplicate img").each(function() {
		var _this=$(this);
		var errorState = true;
		_this.css({opacity: 1}).siblings(".mg-img-default").hide();
		_this.error(function(){
			_this.css({opacity: 0}).siblings(".mg-img-default").show();
		})
	});
	
}
/**
 * 地图位置定位
 * callback 回调函数，取位置
 * 如：getLocation(function(data){
 *          alert(data);
 *     });
 * 
 */
export const getLocation = (obj) => {
	let locationOBJ=obj || {};

	if (navigator.geolocation){   
        navigator.geolocation.getCurrentPosition(showPosition,showError);   
    }else{     
        Tips({
         	'message':'浏览器不支持地理定位。',
    	}); 
    	locationOBJ.callback('深圳');
    }

    function showError(error){ 
	    switch(error.code) {   
	        case error.PERMISSION_DENIED:   
		        Tips({
		         	'message':'定位失败,用户拒绝请求地理定位',
	        	}); 
					
	            break;   
	        case error.POSITION_UNAVAILABLE:   
	        	Tips({
		         	'message':'定位失败,位置信息是不可用',
	        	});   
	            break;   
	        case error.TIMEOUT:  
	        	Tips({
		         	'message':'定位失败,请求获取用户位置超时',
	        	});    
	            break;   
	        case error.UNKNOWN_ERROR: 
	        	Tips({
		         	'message':'定位失败,定位系统失效',
	        	});    
	            break;   
	    }
	   	locationOBJ.callback('深圳');
	} 
	function showPosition(position){   
	    var latlon = position.coords.latitude+','+position.coords.longitude;
	    //baidu百度接口  
	    var url = "http://api.map.baidu.com/geocoder/v2/?ak=C93b5178d7a8ebdb830b9b557abce78b&callback=renderReverse&location="+latlon+"&output=json&pois=0";
	    $.ajax({    
	        type: "GET",    
	        dataType: "jsonp",    
	        url: url,  
	        async: false, 
	        beforeSend: function(){    
	            Tips({
		         	'message':'正在定位...',
	        	}); 
	        	locationOBJ.callback('深圳');
	        },   
	        success: function (json) {    
	            if(json.status==0){ 
	                locationOBJ.callback(json.result.addressComponent.city.replace("市","")); 
	            }else{
	            	Tips({
			         	'message':'地址位置获取失败',
		        	}); 
		        	locationOBJ.callback('深圳');
	            } 
	        },   
	        error: function (XMLHttpRequest, textStatus, errorThrown) {
	            Tips({
		         	'message':'地址位置获取失败',
	        	}); 
	        	locationOBJ.callback('深圳');  
	        }   
	    });    
	}  
}
/**
 * O={
 * 	 mark:"white",  显示遮罩层，如果没值时为黑色透明，white为白色透明
 *   title:"",      为标题，如果没值时不显示标题   
 * 	 message:"",    为提示内容，必填
 *   button:"<a class="mg-col mg-col2" href="">提交</a><a id="btn-close" class="mg-col mg-col2" href="javascript:;">取消</a>",  为下面按钮区，如果没值时不显示铵钮
 *   fn:function(){   弹窗加载完成，回调函数
 *		...
 *	 }
 * }
 *
 */
export const Tips = (o) => {
	let mark = o.mark=="white" ? 'mg-mark' : 'mg-mark-black';
	let title = o.title ? '<h3 class="mg-tips-tit mg-fs32">' + o.title +'</h3>':'';
	let message = o.message ? '<div class="mg-tips-text">' + o.message +'</div>':'';
	let button = o.button ? '<div class="mg-tips-btn mg-g">' + o.button + '</div>' :'';
	
	let alertHtml='<div class="' + mark + ' mg-fadeIn"></div><div class="mg-tips mg-fadeIn">'+ title + message + button + '</div>';
    $('body').append(alertHtml);

	$(".mg-mark,.mg-mark-black").on("click",function(){
		$(".mg-mark,.mg-mark-black,.mg-tips").remove();
	})
	if(!o.button){
		setTimeout(function(){
			$(".mg-mark,.mg-mark-black,.mg-tips").remove();
		},3000)
	}
	if(o.fn){
		o.fn();
	}
}




/***********************************全局挂载(用于工具类函数)***********************************/

/**
 * [setCookie 设置cookie]
 * @param {[type]} cName  [key值]
 * @param {[type]} value  [value值]
 * @param {[type]} expire [过期时间(天)]
 */
window.setCookie = function(cName,value,expire){
	let expireDate = new Date();
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
export const checkLogin = (ltype, backUrl) => {
    let f = "";
    ltype = ltype != null ? ltype : 1;

    $.ajax({
        url: "http://mt.mangocity.com/html5/f/checklogin.shtml",
        dataType: "json",
        data: {
            "mkey": sessionStorage.getItem("mkey")
        },
        async: false,
        success: (data, textStatus) => {
            f = data.flag;
            if(f === "success"){
                sessionStorage.setItem("reg_mobile", data.mobile);
            }
        }
    });

     if(f != 'success'){

        let isunmember = sessionStorage.getItem('user:type');

        if(isunmember){
            f = "unmember";
        }else{
            location.href = "http://mt.mangocity.com/views/user/login.html?type=" + ltype + "&returnUrl=" + encodeURIComponent(backUrl);
        }
       
    }else{
        f = "success";
    }
    return f;
}


/**
 * 获取会员信息
 * (仅在登录场景下)
 * 开发场景下使用mt.mangocity.com 的URL
 */
export const getMbrInfo = () => {
    let mrid = '',mkey = sessionStorage.getItem("mkey");
    if(mkey){
        $.ajax({
            type: "post",
            url: "http://mt.mangocity.com/api/index.php?c=member&m=get_user_info",
            dataType: "json",
            data: {
                "mkey": mkey
            },
            async: false,
            success: (data, textStatus) => {
                if(data){
                     
                    if(data.code && '0000' == data.code){
                        mrid = data.data.mbrID;
                    }
                }
            }
        });
    }

    return mrid;
}

/**
* 获取blob对象的兼容性写法
* @param buffer
* @param format
* @returns {*}
*/
export const getBlob = (buffer, format) => {
    try{
      return new Blob(buffer, {type: format});
    }catch(e){
      var bb = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder);
      buffer.forEach(function(buf) {
        bb.append(buf);
      });
      return bb.getBlob(format);
    }
}

/**
* 获取formdata
*/
export const getFormData = () => {
    var isNeedShim = ~navigator.userAgent.indexOf('Android')
        && ~navigator.vendor.indexOf('Google')
        && !~navigator.userAgent.indexOf('Chrome')
        && navigator.userAgent.match(/AppleWebKit\/(\d+)/).pop() <= 534;

    return isNeedShim ? new FormDataShim() : new FormData()
}

/**
* formdata 补丁, 给不支持formdata上传blob的android机打补丁
* @constructor
*/
export const FormDataShim = () => {
    console.warn('using formdata shim');

    var o = this,
        parts = [],
        boundary = Array(21).join('-') + (+new Date() * (1e16 * Math.random())).toString(36),
        oldSend = XMLHttpRequest.prototype.send;

    this.append = function(name, value, filename) {
      parts.push('--' + boundary + '\r\nContent-Disposition: form-data; name="' + name + '"');

      if (value instanceof Blob) {
        parts.push('; filename="' + (filename || 'blob') + '"\r\nContent-Type: ' + value.type + '\r\n\r\n');
        parts.push(value);
      }
      else {
        parts.push('\r\n\r\n' + value);
      }
      parts.push('\r\n');
    };

    // Override XHR send()
    XMLHttpRequest.prototype.send = function(val) {
      var fr,
          data,
          oXHR = this;

      if (val === o) {
        // Append the final boundary string
        parts.push('--' + boundary + '--\r\n');

        // Create the blob
        data = getBlob(parts);

        // Set up and read the blob into an array to be sent
        fr = new FileReader();
        fr.onload = function() {
          oldSend.call(oXHR, fr.result);
        };
        fr.onerror = function(err) {
          throw err;
        };
        fr.readAsArrayBuffer(data);

        // Set the multipart content type and boudary
        this.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
        XMLHttpRequest.prototype.send = oldSend;
      }
      else {
        oldSend.call(this, val);
      }
    };
}

export const compress = (img) => {
        //使用canvas对大图片进行压缩
        let canvas = document.createElement("canvas"),
            ctx = canvas.getContext('2d');

        //canvas
        let tCanvas = document.createElement("canvas"),
            tctx = tCanvas.getContext("2d");
        console.log(img);
        let initSize = img.src.length,
            width = img.width,
            height = img.height,
            ratio;  //如果图片大于四百万像素，计算压缩比并将大小压至400万以下

        if((ratio = width * height / 4000000) > 1){
            ratio = Math.sqrt(ratio);
            width /= ratio;
            height /= ratio;
        }else{
            ratio = 1;
        }

        canvas.width = width;
        canvas.height = height;

        //铺底色
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //如果图片像素大于100万则使用canvas绘制
        var count;
        if ((count = width * height / 1000000) > 1) {
          count = ~~(Math.sqrt(count) + 1); //计算要分成多少块canvas

          //计算每块canvas的宽和高
          var nw = ~~(width / count);
          var nh = ~~(height / count);

          tCanvas.width = nw;
          tCanvas.height = nh;

          for (var i = 0; i < count; i++) {
            for (var j = 0; j < count; j++) {
              tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);

              ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
            }
          }
        } else {
          ctx.drawImage(img, 0, 0, width, height);
        }

        //进行最小压缩
        var ndata = canvas.toDataURL('image/jpeg', 0.1);

        console.log('压缩前：' + initSize);
        console.log('压缩后：' + ndata.length);
        console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");

        tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;

        return ndata;
    }
