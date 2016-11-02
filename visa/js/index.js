(function() {
	var $$ = function(selever) {
		return document.querySelector(selever);
	};
	var data_json;
	if(!window.localStorage.getItem("json_data")) {
		data_json = {
			countryid: []
		};
	} else {
		data_json = JSON.parse(window.localStorage.getItem("json_data"));
	}
	var domainUrl = 'http://mt.mangocity.com/views/visa/';

	(function init() {
		$.ajax({
			type: "post",
			url: "http://apitest.mangocity.com:8001/apiserver/visa/getVisaIndex",
			dataType: "json",
			data: {},
			success: function(e) {
				if(e.code == 1) {
					for(var i = 0; i < e.data.images.length; i++) {
						$("#swiper-wrapper").append("<div class='swiper-slide'></div>");
						var ele = $("<img class='title_pic' src=" + e.data.images[i].imageUrl + " Data_src=" + e.data.images[i].value + ">");
						$(".swiper-slide").eq(i).append(ele);
					};
					for(var i = 0; i < e.data.hot.length; i++) {
						var ele = $("<dl class='Visa_nav_content' Data_Id='" + e.data.hot[i].countryId + "'><dt class='Visa_nav_content_pic'><img src=" + e.data.hot[i].image + "></dt><dd" +
							" " + " class='Visa_nav_content_title'>" + e.data.hot[i].name + "</dd></dl>");
						$("#Visa_nav_body").append(ele);
					};
					for(var i = 0; i < e.data.recommend.length; i++) {
						var ele = $("<div class='Visa_body_content' data_id='" + e.data.recommend[i].visaId + "' data_name='" + e.data.recommend[i].country + "'><div class='Visa_body_content_pic'><img src=" + e.data.recommend[i].image + "></div><dl" + " " +
							"class='Visa_body_content_visa'><dt class='Visa_body_content_visa_title'>" + e.data.recommend[i].name + "</dt><dd>￥<span" + " " +
							" class='Visa_body_content_visa_price'>" + e.data.recommend[i].price + "</span>起</dd></dl></div>");
						$("#Visa_body_foot").before(ele);
					};
					$(".title_pic").on("click", function() {
						location.href = $(this).attr("Data_src")+"&change=1";
					})
				} else {
					alert("获取信息失败")
				};
				var swiper = new Swiper('.swiper-container', {
					pagination: '.swiper-pagination',
					paginationClickable: true,
					speed: 1000,
					nextButton: '.swiper-button-next',
					prevButton: '.swiper-button-prev',
					paginationClickable: true,
					centeredSlides: true,
					autoplay: 2000,
					autoplayDisableOnInteraction: false
				});
				$(".Visa_nav_content").on("click", function() {
					var country_id = $(this).attr("Data_Id");
					var keyword = escape($(this).find(".Visa_nav_content_title").html());
					data_json.countryid.unshift(keyword);
					window.localStorage.setItem("json_data", JSON.stringify(data_json));
					location.href = domainUrl + "view/search_list.html?keyword=" + keyword + "&CountryId=" + country_id + "&change=1";
				});
				$(".Visa_body_content").on("click", function() {
					var visa_id = $(this).attr("data_id");
					var visa_name = escape($(this).attr("data_name"));
					var keyword = escape($(this).find(".Visa_nav_content_title").html());
					data_json.countryid.unshift(visa_name);
					window.localStorage.setItem("json_data", JSON.stringify(data_json));
					location.href = domainUrl + "view/details.html?visaId=" + visa_id + "&change=1";
				});
			},
			error:function() {  
           // view("异常！");  
           alert("异常！");  
            }  
		});

	})()

	window.onload = function() {
		$$(".confirm").addEventListener("click", function() {
			window.history.go(-1);
		});
		$$("#search").addEventListener("click", function() {
			location.href = domainUrl + "view/search.html"
		});
		setTimeout(function() {
			$("#cover").remove()
		}, 0)
	}

})()