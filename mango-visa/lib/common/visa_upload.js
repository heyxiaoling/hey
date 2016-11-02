var mgUpload;
(function() {

	checkLogin(1, window.location);

	mgUpload = MgUpload();
	window.onload = function() {

		var sUlr = 'http://fileservice.mangocity.cn/apis/fileUpload';
		var columnUrl = 'visa/getIdentityStatus';
		var confirmUrl = 'visa/confirmUploadFiles';
		var domainUrl = 'http://mt.mangocity.com',
			backUrl = 'views/visa/view/visa_order_details.html',
			succUrl = 'views/visa/view/visa_order_details.html';

		var orderId = GetQueryString('orderId');
		var passengerId = GetQueryString('passengerId');
		var prodCode = GetQueryString('productCode');
		var vIndentityType = GetQueryString('visaIndentityType');

		$('#loading').remove();

		//加载所需资料
		var columnParam = {
			orderId: orderId,
			passengerId: passengerId
		};
		uploadAjax(columnUrl, columnParam, function(data) {
			loadColumnItem(data);
		});

		function loadColumnItem(data) {
			var _data = data.data.identitysStatus ? data.data.identitysStatus : '';
			$(_data).each(function(i, item) {

				var colTitle = item.docTypeName,
					colId = item.docTypeId;
				var colStatus = (item.status == null || item.status == 'null') ? 3 : item.status;
				colStatus = parseInt(colStatus);
				colStatus = colStatus == 0 ? 4 : colStatus; //[1 审核通过,2 不通过,3 未上传,4 审核中]

				if (colTitle && colId) {
					var el = '<li class="list-ul-li" data-identityId="' + colId + '"><p class="list-ul-li-a ">';
					el += '<label class="J_li_title" name="' + colId + '" >' + colTitle + '</label>';
					switch (colStatus) {
						case 1:
							el += '<span  class="icon icon-checked mg-feild-incon" data-identityId="' + colId + '">&#xe60c;</span> ';
							break;
						case 2:
							el += '<span class="icon icon-photo-error J_' + colId + '"  >&#xe617;</span>';
							el += '<span  class="icon icon-photo" data-identityId="' + colId + '">&#xe60f;</span> ';
							break;
						case 3:
							el += '<span  class="icon icon-photo " data-identityId="' + colId + '">&#xe60f;</span> ';
							break;
						case 4:
							el += '<span  class="icon icon-photo icon-disable" data-identityId="' + colId + '">&#xe60f;</span> ';
							$('.mg-file-btn p').text('审核中');
							break;
					}
					el += '</p></li>';
					$('.mg-file-info').find('ul').append(el);
				}

			});

			$('.icon-photo').not('.icon-disable').on('touchstart', function() {
				var _colId = $(this).attr('data-identityId');
				mgUpload.loadImgPlate({
					colunmId: _colId,
					limit: 9
				});
			});
		}

		//初始化MgUpload对象
		mgUpload.init({
			sUlr: sUlr,
			sParam: 'file',
			iPlate: '#imgplate',
			imgSub: '.mg-subBtn', //上传按钮
			cancelBtn: '.mg-cancelBtn', //取消按钮
			pathPlate: '#J_data' //图片路径
		}, function(data) {
			mockProgress(data);
		});

		function mockProgress(data) {
			var _width = 0,
				colNum = $('.icon-photo').not('.icon-disable').length;
			var _colData = new Array();
			$('#J_data').find('input', 'hidden').each(function(i, it) {
				var _val = $(it).attr('name');
				if ($.inArray(_val, _colData) < 0) {
					_colData.push(_val);
				}
			});

			var targetNum = data.targetNum,
				factNum = data.factNum,
				colunmId = data.colunmId;
			var realSize = $('#J_data').find('[name="' + colunmId + '"]', 'hidden').length;
			if (colunmId != 0 && factNum > 0 && targetNum == realSize) {
				$('.mg-up-loading').css('display', 'none');
				$('#imgplate').css('display', 'none');
			}

			if (factNum > 0) {
				$('.J_' + colunmId).remove();
				$('label[name="' + colunmId + '"]').addClass('mg-feild-right');
			}

			var _colNum = _colData.length ? _colData.length : 0;
			if (_colNum < colNum) {
				_width = 100 * (_colNum / colNum);
				_width = Math.round(_width);
			} else {
				_width = 100;
			}

			if (_width == 100) {
				$('.mg-file-btn span').removeClass('uncompete');
				$('.mg-file-btn span').addClass('compete');
			}

			//设置进度条
			$('.mg-file-btn span').css('width', _width + '%');

		}

		//返回
		$('.icon-back').on('touchstart', function() {
			location.href = domainUrl + '/' + backUrl + '?orderDetailsId=' + orderId;
		});

		//确认提交资料
		$('.mg-file-a').on('touchstart', function() {
			var subText = $('.mg-file-btn p').text();
			if (subText != '审核中') {
				var pWidth = parseInt($('.mg-file-btn span').css('width').replace('px', '').replace('%', ''));
				var _colData = new Array();
				$('#J_data').find('input', 'hidden').each(function(i, it) {
					var _val = $(it).attr('name');
					if ($.inArray(_val, _colData) < 0) {
						_colData.push(_val);
					}
				});

				var colNum = $('.icon-photo').not('.icon-disable').length,
					_colNum = _colData.length;
				var _certList = new Array();
				$('#J_data').find('input', 'hidden').each(function(i, iItem) {
					var cType = $(iItem).attr('name');
					var imgPath = $(iItem).val();
					var _cert = {
						'certType': cType,
						'imagePath': imgPath
					};
					_certList.push(_cert);

				});

				if (pWidth >= 100 && _certList.length > 0 && colNum == _colNum) {
					var fparam = {
						orderId: orderId,
						passengerId: passengerId,
						certList: _certList
					};

					uploadAjax(confirmUrl, fparam, function(data) {
						loadconfirmState(data);
					});

				} else {
					msg({
						'type': 'alert',
						'text': '请上传相关资料!',
						'btnOkText': '确定',
						'maskbtn': true
					});
				}
			}

		});

		function loadconfirmState(data) {
			if (data.data.flag == true) {
				msg({
					'type': 'alert',
					'text': '操作成功!',
					'btnOkText': '确定',
					'maskbtn': true,
					'success': function() {
						location.href = domainUrl + '/' + succUrl + '?orderDetailsId=' + orderId;
					}
				});

			} else {
				msg({
					'type': 'alert',
					'text': '操作失败,请重试!',
					'btnOkText': '确定',
					'maskbtn': true
				});
			}

		}


		function uploadAjax(url, obj, fn) {
			var params = {};
			$.extend(true, params, obj);

			getDataFromAPI({
				type: "POST",
				url: url,
				data: params,
				dataType: "json",
				success: function(data) {
					if (data.code === "1") {
						fn.call(this, data);
					} else {
						alert('操作失败：' + data.message);
					}
				}
			});
		}


	}



})();