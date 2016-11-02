(function() {
	var domainUrl = 'http://mt.mangocity.com/views/visa/';
	var GetQueryString = function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
		var context = "";
		if(r != null)
			context = r[2];
		reg = null;
		r = null;
		return context == null || context == "" || context == "undefined" ? "" : context;
	};
	var getDataFromAPI = function(obj) {
		var abj = {},
			objObj, objStr;
		if(typeof obj.data === "string") {
			objObj = JSON.parse(obj.data);
			objStr = JSON.stringify(objObj);
		}
		objStr = JSON.stringify(obj.data);
		abj.url = 'http://apitest.mangocity.com:8001/apiserver/' + obj.url;
		abj.async = obj.async || true;
		abj.type = obj.type;
		abj.dataType = obj.dataType || "json";
		abj.data = objStr;
		abj.success = obj.success;
		abj.error = obj.error;
		$.ajax(abj);
	};
	var $$ = function(selever) {
		return document.querySelector(selever);
	};

	var control = function(price_num) {
		var num = $$("#Order_Buy_num_con_num").innerHTML;
		$$("#Order_Buy_num_con_plus").addEventListener("click", function() {
			if(num >= 10) {
				$$("#Bomb_box").style.display = "block";
				return
			}
			num++;
			$$("#Order_Buy_num_con_num").innerHTML = num;
			$$("#Order_foot_price_number").innerHTML = price_num * num;
		});
		$$("#Order_Buy_num_con_reduce").addEventListener("click", function() {
			if(num <= 1) {
				return
			}
			num--;
			$$("#Order_Buy_num_con_num").innerHTML = num;
			$$("#Order_foot_price_number").innerHTML = price_num * num;
		});
	};
	var User_infor = function() {
		var oneself_name = $$("#Order_Data_content_name").value;
		var phoneId = $$("#Order_Data_content_message").value;
		var mail = $$("#Order_Data_content_mail").value;
		var oneself_address = $$("#Order_Data_content_address").value;
		var information = {
			oneself_name: oneself_name,
			phoneId: phoneId,
			mail: mail,
			oneself_address: oneself_address
		};
		window.localStorage.setItem("User_in", JSON.stringify(information));
	};
	var checkLogin = function(ltype, backUrl) {
		User_infor();
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
				if(f == "success") {
					sessionStorage.setItem("reg_mobile", data.mobile);
				}
			}
		});

		if(f != 'success') {
			var isunmember = sessionStorage.getItem('user:type');
			if(isunmember) {
				f = "unmember";
			} else {
				location.href = "http://mt.mangocity.com/views/user/login.html?type=" + ltype + "&returnUrl=" + encodeURIComponent(backUrl);
			}

		} else {
			f = "success";
		}
		return f;
	};
	var getMbrInfo = function() {
		var mrid = '';
		var mkey = sessionStorage.getItem("mkey");
		if(mkey) {

			$.ajax({
				type: "post",
				url: "http://mt.mangocity.com/api/index.php?c=member&m=get_user_info",
				dataType: "json",
				data: {
					"mkey": mkey
				},
				async: false,
				success: function(data, textStatus) {
					if(data) {
						if(data.code && '0000' == data.code) {
							mrid = data.data.mbrID;
						}
					}
				}
			});

		}

		return mrid;
	};
	var getdefaultMbr = function() {
		var defaultMbr = {
			"attribute": 1,
			"defaultMbrship_cd": "660016080703",
			"mbrCd": "MGO02000064875096",
			"mbrId": 43944983,
			"mbrLevel": "One",
			"mbrType": "Individual"
		};
		return defaultMbr.mbrId;
	};

	function Submit(num, price, url) {
		if(num == 1) {
			var retdata = getMbrInfo();
		} else if(num == 2) {
			var retdata = getdefaultMbr();
		};
		var time = $$("#Order_Data_content").value;
		var oneself_name = $$("#Order_Data_content_name").value;
		var phoneId = $$("#Order_Data_content_message").value;
		var mail = $$("#Order_Data_content_mail").value;
		var oneself_address = $$("#Order_Data_content_address").value;
		var Num = $$("#Order_Buy_num_con_num").innerHTML;
		var Total_amount = $$("#Order_foot_price_number").innerHTML;
		var visa_name = $$("#Order_pic_content").innerHTML;
		getDataFromAPI({
			type: "post",
			data: {
				memberId: retdata,
				visaId: visa_Id,
				visaName: visa_name,
				visaPrice: price,
				travelDate: time,
				visaNum: Num,
				amount: Total_amount,
				linkMan: {
					name: oneself_name,
					mobile: phoneId,
					email: mail,
					address: oneself_address
				}
			},
			url: "visa/createOrder",
			success: function(e) {
				if(e.code == 1) {
					getDataFromAPI({
						type: "post",
						data: {
							orderId: e.data.orderId,
							realPayMoney: Total_amount
						},
						url: "visa/getSettlement",
						success: function(a) {
							if(a.code == "1") {
								if(num == 1) {
									location.href = "http://pay.mangocity.cn/alipayService/alipay/payment?orderId=" + e.data.orderId + "&backurl=" + url + e.data.orderId + "";
								} else {
									location.href = "http://pay.mangocity.cn/alipayService/alipay/payment?orderId=" + e.data.orderId + "&backurl=" + url + "";
								};

							} else {
								alert(a.message)
							}
						}
					})

				} else {
					alert(e.message);

				}
			}
		});
	}
	//验证
	var commit = function(price) {
		$$("#Order_foot_price_buy").addEventListener("click", function() {

			if($$("#Order_Data_content").value == "") {
				alert("请输入日期");
				return
			} else if(!(/^[a-zA-Z ]{1,20}$/.test($$("#Order_Data_content_name").value) || /^[\u4e00-\u9fa5]{1,10}$/.test($$("#Order_Data_content_name").value))) {
				if($$("#Order_Data_content_name").value == "") {
					alert("请输入联系人用户名")
				} else {
					alert("请输入正确的用户名")
				}
				return
			} else if(!(/^1[3|4|5|7|8]\d{9}$/.test($$("#Order_Data_content_message").value))) {
				if($$("#Order_Data_content_message").value == "") {
					alert("请输入联系人手机号码")
				} else {
					alert("请输入正确的手机号码")
				}
				return
			} else if(!(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test($$("#Order_Data_content_mail").value))) {
				if($$("#Order_Data_content_mail").value == "") {
					alert("请输入联系人邮箱")
				} else {
					alert("请输入正确的邮箱地址")
				}
				return
			} else if(!(/^[\u4E00-\u9FA5A-Za-z\d\-\_]{5,60}$/.test($$("#Order_Data_content_address").value))) {
				if($$("#Order_Data_content_address").value == "") {
					alert("请输入联系人地址")
				} else {
					alert("请输入正确的地址")
				}
				return
			} else if(checkLogin(1, window.location.href) == 'success') {
				//登录场景获取会mrbid    
				Submit(1, price, domainUrl+"view/visa_order_details.html?orderDetailsId=");
			} else if(checkLogin(1, window.location.href) == "unmember") {
				Submit(2, price, domainUrl+"view/details.html?visaId=" + visaId + "");
			}
		})
	}
	var year = new Date().getFullYear();
	var month = new Date().getMonth();
	var data = new Date().getDate();
	var visa_Id = GetQueryString("visaId");
	var visaId = GetQueryString("visa_Id");
	var advanceDays=parseInt(GetQueryString("advanceDays")==""?0:GetQueryString("advanceDays"));
	
	(function init() {
		//请求数据
		getDataFromAPI({
			type: "post",
			async: false,
			data: {
				visaId: visaId
			},
			url: "visa/getVisaDetail",
			success: function(e) {
				if(e.code == "1") {

					if(window.localStorage.getItem("User_in")) {
						var user = JSON.parse(window.localStorage.getItem("User_in"));
						$$("#Order_Data_content_name").value = user.oneself_name;
						$$("#Order_Data_content_message").value = user.phoneId;
						$$("#Order_Data_content_mail").value = user.mail;
						$$("#Order_Data_content_address").value = user.oneself_address;
					};
					$$("#Order_foot_price_number").innerHTML = e.data.price;
					$$("#Order_pic_content").innerHTML = e.data.name;
					control(e.data.price);
					commit(e.data.price);
				} else {
					alert("获取信息失败,请返回上页重新选择");
					location.href = domainUrl+"view/details.html?visaId=" + visaId + "";
				}

			}
		});
	})();
 
	window.onload = function() {
		$('#Order_Data_content').mdater({
			minDate: new Date(year, month, data+advanceDays),
			maxDate: new Date(year, month + 3, data)
		});

		$$("#Bomb_box_content_remove").addEventListener("click", function() {
			$$("#Bomb_box").style.display = "none"
		});
		$$(".confirm_header").addEventListener("click", function() {
			location.href = domainUrl+"view/details.html?visaId=" + visaId + "&advanceDays="+advanceDays+"";
		});
		setTimeout(function() {
			$("#cover").remove()
		}, 0)

	}
})()