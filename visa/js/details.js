(function() {
	    var domainUrl = 'http://mt.mangocity.com/views/visa/';
	    var countryName;
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
	var visa_Id = GetQueryString("visaId");
	var advanceDays;
	var visa_code;
	var contorl = function() {
		$(".identity").on("click", function() {
			var value = escape($(this).children("span:first-child").html());
			location.href = domainUrl+"view/material.html?Occupation=" + value + "&visaId=" + visa_Id + "";
		});
		$("#Details_content_foot_buy").on("click", function() {
			location.href = domainUrl+"view/order.html?visaId=" + visa_code + "&visa_Id=" + visa_Id + "&advanceDays="+advanceDays+"";
		});
	};
	(function init() {
		getDataFromAPI({
			type: "post",
			data: {
				visaId: visa_Id
			},
			url: "visa/getVisaDetail",
			success: function(e) {
				try {
					if(e.code == "1") {
						countryName=e.data.countryName;
						advanceDays=e.data.advanceDays;
						$$(".header_content").innerText = e.data.countryName + "签证";
						$$(".Details_pic").src = e.data.images;
						$$(".Details_title_content").innerHTML = e.data.name;
						$$(".Details_title_price_font").innerHTML = e.data.price;
						$$("#frequency").innerHTML = e.data.entryNumber;
						$$("#days").innerHTML = e.data.stayDays;
						$$("#validity").innerHTML = e.data.validDays;
						$$("#service_content").innerHTML = e.data.signOff;
						$$("#Interview").innerHTML = e.data.interview;
						$$("#service_fingerprint").innerHTML = e.data.fingerprint;
						$$("#For_long_time").innerHTML = e.data.handleDays;
						$$("#Acceptance_range").innerHTML = e.data.attendRange;
						$$("#Cost_description").innerHTML = e.data.feeCaption;
						$$("#Prompt_reservation").innerHTML = e.data.orderPoints;
						$$("#Bomb_box_content_ID").innerHTML = e.data.visaId;
						$(".identity").attr("visaId", visa_Id);
						visa_code = e.data.visaCode;
						for(var i = 0; i < e.data.requiredInfo.length; i++) {
							$("#Occupation").append("<div class='identity'><span>" + e.data.requiredInfo[i].typeDesc + "</span><span>需要材料" + e.data.requiredInfo[i].itemNumber + "项></span></div>");
						};
						contorl();
					} else {
						alert("获取信息失败,请返回上页重新选择");
						window.history.go(-1)
					}
				} catch(e) {
					alert("获取信息失败,请返回上页重新选择");
					window.history.go(-1)
				}

				setTimeout(function() {
					$("#cover").remove()
				}, 0)
			}
		});
	})()

	window.onload = function() {
		$$("#wrapper").addEventListener("scroll", function() {
			if(this.scrollTop + 47 >= $$(".Details_content").offsetTop) {
				$$(".Details_content_title").style.position = "fixed";
				$$(".Details_content_title").style.top = 45 + "px";
				$$(".Details_content_title").style.left = 0;
				$$(".Details_content_title").style.right = 0;
			} else {
				$$(".Details_content_title").style.position = "absolute";
				$$(".Details_content_title").style.top = 0;
			}
		});
		var swiper = new Swiper('.swiper-container', {
			speed: 500,
			onSlideChangeStart: function() {
				$(".Details_content_title>.Details_content_title1").removeClass("Details_content_title1");
				$(".Details_content_title>span").eq(swiper.activeIndex).addClass("Details_content_title1")
			}
		});
		$(".Details_content_title>span").on("touchstart", function() {
			$(".Details_content_title>.Details_content_title1").removeClass("Details_content_title1");
			$(this).addClass("Details_content_title1");
			swiper.slideTo($(this).index());
		});
		$("#reservation").on("click", function() {
			$("#Bomb_box").show()
		});
		$("#confirm_remove").on("click", function() {
			$("#Bomb_box").hide()
		});
		$(".confirm").on("click", function() {
			if (GetQueryString("change")!="") {
				window.history.go(-1);
			} else{
				location.href = domainUrl+"view/search_list.html?keyword="+escape(countryName)+"";
			}
			
		});

	}

})()  