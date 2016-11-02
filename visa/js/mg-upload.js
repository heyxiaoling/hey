/**
 *  Depends:jQuery
 */
function MgUpload() {

	var canvas, tCanvas, ctx, tctx;
	var imgPlate;
	var maxsize = 100 * 1024;
	var serviceInfo;

	/**
	 * [init description]
	 * @param  {[type]}   
	   options{
	 		sUlr:required,上传路径
			sParam:required,上传参数,eg:'file' 
			iPlate:required,图片预览容器,eg:'#imgplate'
			imgSub:required,上传按钮,eg:'.mg-subBtn'
			cancelBtn:required,取消按钮,eg:'.mg-cancelBtn'
			pathPlate: required,图片路径,eg:'#J_data'
		}
	 * @param  {Function} 
		fn({
			targetNum,目标个数
			factNum,实际上传个数
			colunmId 资料栏编号
		})
	 * @return 
	 */
	function init(options, fn) {
		serviceInfo = {
			sUlr: '',
			sParam: '', //required,上传参数div
			iPlate: '', //required,图片预览容器,eg:
			imgSub: '', //上传按钮
			cancelBtn: '', //取消按钮
			pathPlate: '' //图片路径
		};

		$.extend(true, serviceInfo, options);
		imgPlate = $(serviceInfo.iPlate);

		if (!canvas) {
			canvas = document.createElement("canvas");
			ctx = canvas.getContext('2d');
		}
		if (!tCanvas) {
			tCanvas = document.createElement("canvas");
			tctx = tCanvas.getContext("2d");
		}

		var cancelBtn = $(imgPlate).find(serviceInfo.cancelBtn);
		$(cancelBtn).on("touchstart", function() {
			var addLiForm = document.getElementById('addForm');
			addLiForm.reset();
			$(imgPlate).css('display', 'none');
			$(imgPlate).find('li').not('.mg-pic-add').html('');
			fn.call(this, {
				targetNum: 0,
				factNum: 0,
				colunmId: 0
			});
		});

		var subBtn = $(imgPlate).find(serviceInfo.imgSub);
		$(subBtn).on("touchstart", function() {

			var _liSize = $(imgPlate).find('li').not('.mg-pic-add').length
			var nParam = {
				proSize: 0,
				liSize: _liSize
			};

			var _target = $(imgPlate).find('li img').length;
			$($(imgPlate).find('li img')).each(function(i, el) {
				var ftype = $(el).attr('data-type');
				ftype = !/\/(?:jpeg|png|gif)/i.test(ftype) ? 'png' : ftype;
				var fPropety = {
					colunmId: $(el).attr('data-column'),
					fName: $(el).attr('title'),
					ftype: ftype
				};
				var result = el.src;
				upload2S(result, fPropety, nParam, fn);
			});

			if (_target == 0 && _liSize > 0) {
				$(imgPlate).css('display', 'none');
				$(imgPlate).find('li').not('.mg-pic-add').remove();
			}
		});

	}


	/**
	 * [loadImgPlate 加载图片面板]
	 * @param  {colunmId,limit} options [资料栏编号,文件限制个数]
	 * @return  
	 */
	function loadImgPlate(options) {
		var _options = {
			colunmId: '',
			limit: 9
		};
		$.extend(true, _options, options);

		$('#imgplate').find('li').not('.mg-pic-add').remove();
		if ($('.mg-up-loading').css('display') != 'none') {
			$('.mg-up-loading').css('display', 'none');
		}

		$('.mg-pic-file').remove();
		$('#addForm').off();

		var addLiForm = document.getElementById('addForm');
		addLiForm.reset();
		$(imgPlate).find('.mg-pic-add').css({
			'visibility': 'visible',
			'position': 'relative'
		});

		var addLiFile = '<input type="file" name="file' +
			_options.colunmId + '" multiple="multiple" class="mg-pic-file" id="btn_' + _options.colunmId + '">';
		$(addLiForm).append($(addLiFile));
		$(addLiForm).on('change', function() {
			chooseImg({
				colunmId: _options.colunmId,
				limit: _options.limit
			});

		});


		//加载已上传过的图片
		var selectedImgs = $(serviceInfo.pathPlate).find('[name="' + _options.colunmId + '"]', 'hidden');
		var selectedSize = selectedImgs ? selectedImgs.length : 0;
		if (selectedSize > 0) {
			$.each(selectedImgs, function(i, _input) {

				if ($(_input).attr('name') == _options.colunmId && typeof(_options.colunmId) != 'undefined') {
					var _li = document.createElement('li');
					var imgResult = $(_input).attr('data-column');
					var _onlineImg = document.createElement('i');
					$(_onlineImg).css('background-image', 'url(' + imgResult + ')');
					$(_li).append($(_onlineImg));
					$(imgPlate).find('ul').prepend($(_li));
					$(_onlineImg).on('touchstart', function() {
						makeImgView(imgResult);
					});

					var _deltip = document.createElement("div");
					$(_deltip).addClass('mg-pic-del');
					$(_li).append(_deltip);
					$(_deltip).on('touchstart', function() {
						$(_li).remove();
						$(_input).remove();
						if ($(imgPlate).find('li i').not('.mg-pic-add').length == 0) {
							$('label[name="' + _options.colunmId + '"]').removeClass('mg-feild-right');
						}
						var _selectSize = $(imgPlate).find('li').not('.mg-pic-add').length;
						if (_selectSize < _options.limit) {
							$(imgPlate).find('.mg-pic-add').css({
								'visibility': 'visible',
								'position': 'relative'
							});
						}

					});
				}
			});
		}

		if (selectedSize >= _options.limit) {
			$(imgPlate).find('.mg-pic-add').css({
				'visibility': 'hidden',
				'position': 'absolute'
			});
		} else {
			$(imgPlate).find('.mg-pic-add').css({
				'visibility': 'visible',
				'position': 'relative'
			});
		}
		$(imgPlate).css('display', 'block');

	}


	/**
	 * [chooseImg 选择图片]
	 * @param {[type]}  options {colunmId,limit} [资料栏编号,文件限制个数]
	 * @return 
	 */
	function chooseImg(options) {
		var chooser = {
			colunmId: '',
			limit: 9
		};
		$.extend(true, chooser, options);

		var _addForm = document.getElementById('addForm');
		try {
			var files = Array.prototype.slice.call(_addForm[0].files);
			var fsize = $(imgPlate).find('li').not('.mg-pic-add').length;
			//console.log('files ' + files.length);
			if (fsize + files.length > chooser.limit) {
				msg({
					'type': 'alert',
					'text': '同一栏资料最多只可上传' + chooser.limit + '张图片!',
					'btnOkText': '确定',
					'maskbtn': true
				});
				return;
			}

			if (files.length > 0) {
				files.forEach(function(file, i) {
					if (!/\/(?:jpeg|png|gif)/i.test(file.type)) {
						msg({
							'type': 'alert',
							'text': '请选择图片文件!',
							'btnOkText': '确定',
							'maskbtn': true
						});
						return;
					}

					//获取图片大小
					var size = file.size / 1024 > 1024 ? (~~(10 * file.size / 1024 / 1024)) / 10 + 'MB' : ~~(file.size / 1024) + 'KB';
					var li = document.createElement('li');
					$(imgPlate).find('ul').prepend($(li));
					$(li).addClass('bg-load');
					var reader = new FileReader();
					reader.onload = function() {
						var result = this.result;
						var img = new Image();
						img.src = result;
						$(img).on('touchstart', function() {
							makeImgView(img.src);
						});

						//console.log('result' + result.length + ',图片加载完毕之后进行压缩.');
						if (img.complete) {
							callback();
						} else {
							img.onload = callback;
						}

						function callback() {
							result = compress(img);
						}

						img.src = result;
						$(img).attr('data-type', file.type);
						$(img).attr('data-column', chooser.colunmId);
						$(img).attr('title', file.name);
						$(li).append($(img));

						$(li).removeClass('bg-load');

						var deltip = document.createElement("div");
						deltip.setAttribute('class', 'mg-pic-del');
						$(li).append(deltip);
						$(deltip).on('touchstart', function() {
							$(li).remove();
							if ($(imgPlate).find('li').not('.mg-pic-add').length == 0) {
								$('label[name="' + chooser.colunmId + '"]').removeClass('mg-feild-right');
							}
							if ($(imgPlate).find('li').not('.mg-pic-add').length < chooser.limit) {
								//$(imgPlate).find('.mg-pic-add').show();
								$(imgPlate).find('.mg-pic-add').css({
									'visibility': 'visible',
									'position': 'relative'
								});
							}
						});

					};

					reader.readAsDataURL(file);

				});
			}


			if ($(imgPlate).find('li').not('.mg-pic-add').length == chooser.limit) {
				$(imgPlate).find('.mg-pic-add').css({
					'visibility': 'hidden',
					'position': 'absolute'
				});
			} else {
				$(imgPlate).find('.mg-pic-add').css({
					'visibility': 'visible',
					'position': 'relative'
				});
			}

		} catch (e) {
			alert(e);
		} finally {
			_addForm.reset();
		}



	}


	/**
	 * [upload2S 图片上传，将base64的图片转成二进制对象，塞进formdata上传]
	 * @param  {[type]}   basestr  [图片base64内容]
	 * @param  {[type]}   fPropety{colunmId,fName,ftype} [文件相关参数,{资料栏编号,文件名称,文件类型}]
	 * @param  {[type]}   nParam{proSize,liSize} [文件目标个数与实际已操作个数]
	 * @param  {Function} fn [回调方法]
	 * @return 
	 */
	function upload2S(basestr, fPropety, nParam, fn) {
		var pecent = 0,
			loop = null;
		var colunmId = fPropety.colunmId;
		var fName = fPropety.fName;

		var _basestr = basestr.split(",")[1];
		//_basestr = _basestr.replace(/\s/g, '');
		var text = window.atob(_basestr);
		var ab = new ArrayBuffer(text.length);
		var buffer = new Uint8Array(ab);
		for (var i = 0; i < text.length; i++) {
			buffer[i] = text.charCodeAt(i);

		}

		var blob = getBlob([buffer], fPropety.ftype);
		var xhr = new XMLHttpRequest();
		var formdata = needsFormDataShim ? new FormDataShim() : new FormData();
		formdata.append(serviceInfo.sParam, blob, fName);

		xhr.open('post', serviceInfo.sUlr);
		if ($('.mg-up-loading').css('display') == 'none') {
			showLoadFlower();
		}

		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var imagedata = {};
				var jsonData = JSON.parse(xhr.responseText);
				if (jsonData.Code == '00' && jsonData.result != null) {
					imagedata = jsonData.result || {};
				}

				var text = imagedata.filePath ? '上传成功' : '上传失败';
				nParam.proSize++;
				if (imagedata.filePath) {
					var el = '<input type="hidden" name="' + colunmId + '" value="' + imagedata.filePath + '" data-column="' + basestr + '" />'; //document.createElement('input');
					//el.setAttribute('type', 'hidden');
					//el.setAttribute('name', colunmId);
					//el.setAttribute('value', imagedata.filePath);
					//el.setAttribute('data-column', basestr);

					$(serviceInfo.pathPlate).append(el);
				}

				fn.call(this, {
					targetNum: nParam.liSize,
					factNum: nParam.proSize,
					colunmId: colunmId
				});

			} else if (xhr.status != 200) {
				nParam.proSize++;

				fn.call(this, {
					targetNum: nParam.liSize,
					factNum: nParam.proSize,
					colunmId: colunmId
				});
				msg({
					'type': 'alert',
					'text': '网络异常!',
					'btnOkText': '确定',
					'maskbtn': true
				});

			}
		};

		xhr.upload.addEventListener('progress', function(e) {
			pecent = ~~(100 * e.loaded / e.total) / 2;
			showLoadFlower();
			if (pecent == 10) {
				if ($('.mg-up-loading').css('display') == 'none') {
					showLoadFlower();
				}
			}
		}, false);

		xhr.send(formdata);

	}


	/**
	 * [compress 使用canvas对图片进行压缩]
	 * @param  {[type]} img [图片对象]
	 * @return {*}   
	 */
	function compress(img) {
		var initSize = img.src.length;
		var width = img.width;
		var height = img.height;

		//如果图片大于四百万像素，计算压缩比并将大小压至400万以下
		var ratio;
		if ((ratio = width * height / 4000000) > 1) {
			ratio = Math.sqrt(ratio);
			width /= ratio;
			height /= ratio;
		} else {
			ratio = 1;
		}

		canvas.width = width;
		canvas.height = height;

		//铺底色
		ctx.fillStyle = "#fff";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		//如果图片像素大于100万则使用瓦片绘制
		var count;
		if ((count = width * height / 1000000) > 1) {
			count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片

			//计算每块瓦片的宽和高
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
		//console.log('压缩前：' + initSize);
		//console.log('压缩后：' + ndata.length);
		//console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");

		tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
		return ndata;
	}


	/**
	 * 获取blob对象的兼容性写法
	 * @param buffer
	 * @param format
	 * @returns {*}
	 */
	function getBlob(buffer, format) {
		var blob;
		try {
			blob = new Blob(buffer, {
				type: format
			});

		} catch (e) {

			window.BlobBuilder = window.BlobBuilder ||
				window.WebKitBlobBuilder ||
				window.MozBlobBuilder ||
				window.MSBlobBuilder;

			if (e.name == 'TypeError' && window.BlobBuilder) {
				var bb = new BlobBuilder();
				bb.append(buffer);
				blob = bb.getBlob(format);

			} else if (e.name == "InvalidStateError") {
				blob = new Blob([buffer], {
					type: format
				});

			} else {
				alert('请使用其他流量器进行上传！');
			}
		}
		return blob;
	}

	/**
	 * [判断浏览器兼容情况]
	 * @param  {[type]} )	
	 * @return 
	 */
	var needsFormDataShim = (function() {
			var bCheck = ~navigator.userAgent.indexOf('Android') && ~navigator.vendor.indexOf('Google') && !~navigator.userAgent.indexOf('Chrome');
			if (bCheck == 0 && (navigator.userAgent.indexOf('UCBrowser') > 0 && navigator.userAgent.indexOf('Android') > 0)) {
				bCheck = 1;
			}
			return bCheck && navigator.userAgent.match(/AppleWebKit\/(\d+)/).pop() <= 534;
		})(),
		blobConstruct = !!(function() {
			try {
				return new Blob();
			} catch (e) {}
		})(),
		XBlob = blobConstruct ? window.Blob : function(parts, opts) {
			var bb = new(window.BlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder);
			parts.forEach(function(p) {
				bb.append(p);
			});

			return bb.getBlob(opts ? opts.type : undefined);
		};


	/**
	 * [FormDataShim formdata 补丁, 给不支持formdata上传blob的android机打补丁]
	 */
	function FormDataShim() {
		var o = this,
			parts = [],
			boundary = Array(21).join('-') + (+new Date() * (1e16 * Math.random())).toString(36),
			oldSend = XMLHttpRequest.prototype.send;

		this.append = function(name, value, filename) {
			parts.push('--' + boundary + '\r\nContent-Disposition: form-data;name="' + name + '"');

			if (value instanceof Blob) {
				filename = !filename ? 'blob' : filename;
				var _filename = filename.indexOf('.') > 0 ? filename : (filename + '.' + value.type.replace('image/', ''));
				parts.push(';filename="' + _filename + '"\r\nContent-Type: ' + value.type + '\r\n\r\n');
				parts.push(value);
			} else {
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
				//data = getBlob(parts);
				data = new XBlob(parts);

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
				this.setRequestHeader('Content-Type', 'multipart/form-data;boundary=' + boundary);
				XMLHttpRequest.prototype.send = oldSend;
			} else {
				oldSend.call(this, val);
			}
			showLoadFlower();
		};


	}


	/**
	 * [makeImgView 放大图片]
	 * @param  {[type]} img [图片对象]
	 * @return     
	 */
	function makeImgView(bgResult) {
		var maxView = document.createElement("div");
		$(maxView).attr('class', 'mg-max-view');
		$(maxView).css('background-image', 'url(' + bgResult + ')');
		$(maxView).css('background-repeat', 'no-repeat');
		$(maxView).css('background-position', 'center');
		$(maxView).css('background-size', 'contain');
		$(imgPlate).append($(maxView));

		var viewClose = document.createElement('span');
		$(viewClose).attr('class', 'mg-view-close');
		$(maxView).append($(viewClose));
		$(viewClose).on('touchstart', function() {
			$(maxView).remove();
		});
	}

	function showLoadFlower() {
		$('.mg-up-loading').css('display', 'inline-block');
		$('.mg-up-loading').css('height', $('.mg-pic-list').css('height'));
	}


	return {
		init: function(options, fn) {
			init(options, fn);
		},
		loadImgPlate: function(options) {
			loadImgPlate(options);
		},
		choose: function(options, fn) {
			chooseImg(options, fn);
		}
	};

}