(function() {
	var num = 1;
	var index;
	var index_next;
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

	function getDataFromAPI(obj) {
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

	function getVisaList(da, that, index_id) {
		that.css("display", "none");
		$(".visa_type").eq(index_id).removeClass("visa_type_color").children().removeClass("iconfont_rotate");
		num = 1;
		getDataFromAPI({
			type: "post",
			data: da,
			url: "visa/getVisaList",
			success: function(e) {
				document.querySelector("#wrapper").innerHTML = "";
				if(e.code == "1") {
					if(e.data.totalCount == 0) {
						if(GetQueryString("key") != "") {
							document.querySelector("#wrapper").innerHTML = "<div class='wrapper_title'>您需要的产品还未上架,可以先浏览其他产品哦~</div>";
						} else {
							document.querySelector("#wrapper").innerHTML = "<div class='wrapper_title'>没有找到符合条件的结果,请修改条件重新查询</div>";
						}

					};
					for(var i = 0; i < e.data.visaList.length; i++) {
						var ele = $("<div class='search_list_content' Data-Id='" + e.data.visaList[i].visaId + "'><div class='search_list_content_title'>" + e.data.visaList[i].name + "</div><div class='search_list_content_Label'></div><div class='search_list_content_bottom'><div class='search_list_content_bottom_left'><span class='confirm_Reserve'>&#xe60b;</span><span>提前" + (e.data.visaList[i].advanceDays ? e.data.visaList[i].advanceDays : 0) + "个工作日预定</span></div><div class='search_list_content_bottom_right'><span>￥</span><span>&nbsp;" + parseInt(e.data.visaList[i].price) + "</span></div></div></div>");
						$("#wrapper").append(ele);
						if(e.data.visaList[i].tag != undefined) {
							var str = e.data.visaList[i].tag;
							var data_str = str.split(",");
							for(var n = 0; n < data_str.length; n++) {
								var ele = $("<span>&nbsp;" + data_str[n] + "&nbsp;</span>");
								$(".search_list_content_Label").eq(i).append(ele);
							}
						}
					};

				} else {
					alert("签证国家/售卖站错误,请返回上页重新选择");
				};
				$(".search_list_content").on("tap", function() {
					var codeid = $(this).attr("data-id");
					location.href = domainUrl + "view/details.html?visaId=" + codeid + "";
				})
			}
		});
	};
	var keyword = unescape(GetQueryString("keyword"));
	var country_id = unescape(GetQueryString("CountryId"));
	var type_visa = {};
	type_visa.address = "";
	type_visa.visaType = "";
	type_visa.sort = "";
	(function init() {

		//签证类型
		getDataFromAPI({
			type: "post",
			url: "visa/getVisaTypes",
			success: function(e) {
				for(var i = 0; i < e.data.parameters.length; i++) {
					$("#Tourist_visa_content_type").append("<div class='Tourist_visa'><span class='confirm'>&#xe60c;</span><span class='Tourist_visa_button' CodeId='" + e.data.parameters[i].code + "'>" + e.data.parameters[i].name + "</span></div>")
				};
				$(".Tourist_visa_button").on("tap", function() {
					$("#VisaType").html($(this).html());
					var codeid = $(this).attr("CodeId");
					type_visa.visaType = codeid;
					var that = $(this).parent().parent().parent();
					var index_id = $(this).parent().parent().parent().index();
					getVisaList({
						visaType: codeid,
						address: type_visa.address,
						sort: type_visa.sort,
						keywords: keyword
					}, that, index_id)
				})
			}
		});
		//常住地
		getDataFromAPI({
			type: "post",
			url: "visa/getCities",
			success: function(e) {
				for(var i = 0; i < e.data.parameters.length; i++) {
					$("#Tourist_visa_content_city").append("<li class='Tourist_visa_city' Data-Code='" + e.data.parameters[i].code + "'>" + e.data.parameters[i].name + "</li>")
				};
				$(".Tourist_visa_city").on("tap", function() {
					$("#PermanentPlace").html($(this).html());
					var codeid = $(this).attr("Data-Code");
					type_visa.address = codeid;
					var that = $(this).parent().parent().parent();
					var index_id = $(this).parent().parent().parent().index();
					getVisaList({
						address: codeid,
						visaType: type_visa.visaType,
						sort: type_visa.sort,
						keywords: keyword
					}, that, index_id)
				});
				$("#type_Unlimited").on("tap", function() {
					$("#PermanentPlace").html($(this).html());
					var that = $(this).parent().parent();
					var index_id = $(this).parent().parent().index();
					type_visa.address = "";
					getVisaList({
						visaType: type_visa.visaType,
						address: type_visa.address,
						keywords: keyword,
						sort: type_visa.sort,
					}, that, index_id)
				})
			}
		});

		//产品列表

		getDataFromAPI({
			type: "post",
			data: {
				keywords: keyword,
				country: country_id
			},
			url: "visa/getVisaList",
			success: function(e) {
				if(e.code == "1") {
					document.querySelector(".header_content").innerHTML = keyword;
					document.querySelector("#wrapper").innerHTML = "";
					if(e.data.totalCount == 0) {
						if(GetQueryString("key") != "") {
							document.querySelector("#wrapper").innerHTML = "<div class='wrapper_title'>您需要的产品还未上架,可以先浏览其他产品哦~</div>";
						} else {
							document.querySelector("#wrapper").innerHTML = "<div class='wrapper_title'>没有找到符合条件的结果,请修改条件重新查询</div>";
						}
					};
					for(var i = 0; i < e.data.visaList.length; i++) {
						var ele = $("<div class='search_list_content' Data-Id='" + e.data.visaList[i].visaId + "'><div class='search_list_content_title'>" + e.data.visaList[i].name + "</div><div class='search_list_content_Label'></div><div class='search_list_content_bottom'><div class='search_list_content_bottom_left'><span class='confirm_Reserve'>&#xe60b;</span><span>提前" + (e.data.visaList[i].advanceDays ? e.data.visaList[i].advanceDays : 0) + "个工作日预定</span></div><div class='search_list_content_bottom_right'><span>￥</span><span>&nbsp;" + parseInt(e.data.visaList[i].price) + "</span></div></div></div>");
						$("#wrapper").append(ele);

						if(e.data.visaList[i].tag != undefined) {
							var str = e.data.visaList[i].tag;
							var data_str = str.split(",");

							for(var n = 0; n < data_str.length; n++) {
								var ele = $("<span>&nbsp;" + data_str[n] + "&nbsp;</span>");
								$(".search_list_content_Label").eq(i).append(ele);
							}
						}
					};
				} else {
					alert("签证国家/售卖站错误,请返回上页重新选择");
					window.history.go(-1)
				};
				$(".type_comprehensive").on("tap", function() {
					$("#Sort").html($(this).find("span:last-child").html());
					var codeid = $(this).attr("Data-Id");
					type_visa.sort = codeid;
					var that = $(this).parent().parent();
					var index_id = $(this).parent().parent().index();
					getVisaList({
						visaType: type_visa.visaType,
						sort: codeid,
						address: type_visa.address,
						keywords: keyword
					}, that, index_id)
				});
				$(".search_list_content").on("tap", function() {
					var codeid = $(this).attr("data-id");
					location.href = domainUrl + "view/details.html?visaId=" + codeid + "";
				});
			}
		});

	})();

	window.onload = function() {
		$(".visa_type").on("tap", function() {
			if(num == 1) {
				if($(this).index() == index_next) {
					$(this).removeClass("visa_type_color").children().removeClass("iconfont_rotate");
					$(".Tourist_visa_cover").css("display", "none");
					num = 2
				} else {
					index = $(this).index();
					$(".Tourist_visa_cover").css("display", "none");
					$(this).addClass("visa_type_color").siblings().removeClass("visa_type_color");
					$(this).children().addClass("iconfont_rotate");
					$(this).siblings().children().removeClass("iconfont_rotate");
					$(".Tourist_visa_cover").eq(index).css("display", "block");
					num = 2
				}
			} else {
				if($(this).index() == index) {
					$(this).removeClass("visa_type_color").children().removeClass("iconfont_rotate");
					$(".Tourist_visa_cover").css("display", "none");
					num = 1
				} else {
					index_next = $(this).index();
					$(".Tourist_visa_cover").css("display", "none");
					$(this).addClass("visa_type_color").siblings().removeClass("visa_type_color");
					$(this).children().addClass("iconfont_rotate");
					$(this).siblings().children().removeClass("iconfont_rotate");
					$(".Tourist_visa_cover").eq($(this).index()).css("display", "block");
					num = 1
				}
			}
		});
		$(".Tourist_cover").on("tap", function() {
			$(".visa_type").eq($(this).parent().index()).removeClass("visa_type_color").children().removeClass("iconfont_rotate");
			$(this).parent().css("display", "none");
			num = 1;
		});
		setTimeout(function() {
			$("#cover").remove()
		}, 0);
		$(".confirm_header").on("click", function() {
			if(GetQueryString("change") != "") {
				window.history.go(-1);
			} else {
				location.href = domainUrl + "view/search.html"
			}

		});

	}
})()