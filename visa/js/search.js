(function() {
	var storage = window.localStorage;
	var getArray = function(a) {
		var hash = {},
			len = a.length,
			result = [];
		for(var i = 0; i < len; i++) {
			if(!hash[a[i]]) {
				hash[a[i]] = true;
				result.push(a[i]);
			}
		}
		return result;
	};
	var $$ = function(selever) {
		return document.querySelector(selever);
	};
	var contorl = function() {
			$$("#visa_search_input").addEventListener("click", function() {
				$$("#cancel").style.display = "block";
				$$("#body_content_cover").style.display = "block"
			});
			
			$$("#visa_search_input").addEventListener("keydown", function(event){
				 if(event.keyCode==13||event.which==13){
                    event.preventDefault();
                    window.location.href="http://mt.mangocity.com/views/visa/view/search_list.html?keyword="+escape(this.value)+"";
                     return false; 
                }
			});

			$$("#cancel").addEventListener("click", function(e) {
				$$("#visa_search_input").value = "";
				$$("#body_content_cover").style.display = "none";
				$$("#cancel").style.display = "none";
			});

			$("#body_content_fixed>span").on("click", function() {
				var scroll_num = $(this).html();
				var scroll_value = document.querySelector(".alphabet_" + scroll_num + "").offsetTop;
				$("#wrapper").scrollTop(scroll_value);
			});
			$(".dest_choose_letter>a").on("tap", function() {
				var country_id = $(this).attr("Data_Id");
				var country_value = escape($(this).html()) + "";
				data_json.countryid.unshift(country_value);
				localStorage.setItem("json_data", JSON.stringify(data_json));
				location.href = "http://mt.mangocity.com/views/visa/view/search_list.html?keyword=" + country_value + "&CountryId=" + country_id + "&key=product";
			});
			$(".search_list").on("tap", function() {
				var country_value = escape($(this).html()) + "";
				var country_id = $(this).attr("data_id");
				data_json.countryid.unshift(country_value);
				storage.setItem("json_data", JSON.stringify(data_json));
				location.href = "http://mt.mangocity.com/views/visa/view/search_list.html?keyword=" + country_value + "&CountryId=" + country_id + "&key=product";
			});
			$(".visa_search_country_content").on("tap", function() {
				var country_id = $(this).attr("Data_Id");
				var country_value = escape($(this).html()) + "";
				data_json.countryid.unshift(country_value);
				storage.setItem("json_data", JSON.stringify(data_json));
				location.href = "http://mt.mangocity.com/views/visa/view/search_list.html?keyword=" + country_value + "&CountryId=" + country_id + "&key=product";
			});
			$(".list").on("tap", function() {
				var country_value = escape($(this).html()) + "";
				data_json.countryid.unshift(country_value);
				storage.setItem("json_data", JSON.stringify(data_json));
				location.href = "http://mt.mangocity.com/views/visa/view/search_list.html?keyword=" + country_value + "&key=product";
			})
			$("#visa_search_buttonback").on("click", function() {
				location.href = "http://mt.mangocity.com/views/visa/index.html";
			});
		}
		//最近访问
	var data_json;
	if(!storage.getItem("json_data")) {
		data_json = {
			countryid: []
		};
	} else {
		data_json = JSON.parse(storage.getItem("json_data"));
		data_json.countryid = getArray(data_json.countryid)
		storage.setItem("json_data", JSON.stringify(data_json));
		data_json = JSON.parse(storage.getItem("json_data"));
		$$("#visa_search_country_vist").innerHTML = "";
		for(var i = 0; i < data_json.countryid.length; i++) {
			if(i > 2) {
				break
			}
			var ele = $("<div class='list'>" + unescape(data_json.countryid[i]) + "</div>");
			$("#visa_search_country_vist").append(ele);
		}

	}

	(function init() {

		//请求数据
		$.ajax({
			type: "post",
			url: "http://apitest.mangocity.com:8001/apiserver/visa/getCountries",
			dataType: "json",
			data: {},
			success: function(e) {

				for(var n = 0; n <= 25; n++) {
					var j = String.fromCharCode((65 + n));
					for(var i = 0; i < e.data.countries.length; i++) {
						var str = e.data.countries[i].firstLetter + "";
						if(str.toUpperCase() == j) {
							$(".alphabet_" + j + "").next().append("<a href='javascript:;' Data_Id='" + e.data.countries[i].code + "'>" + e.data.countries[i].name + "</a>")
						}
					}
				};

				for(var i = 0; i < e.data.hot.length; i++) {
					var ele = $("<div class='visa_search_country_content' Data_Id='" + e.data.hot[i].code + "'>" + e.data.hot[i].name + "</div>");
					$("#visa_search_hot_vist").append(ele);
				};

				for(var i = 0; i < e.data.countries.length; i++) {
					$("#body_content_cover").append("<div class='search_list' data-index='" + e.data.countries[i].name + "—" + e.data.countries[i].pinYin + "—" + e.data.countries[i].simpleSpell + "—" + e.data.countries[i].ename.toLowerCase() + "' data_id='" + e.data.countries[i].code + "'>" + e.data.countries[i].name + "</div>")
				};
				contorl();
				setTimeout(function() {
					$("#cover").remove()
				}, 0)
			}
		});
	})()

	window.onload = function() {
		//搜索
		var eleStyle = document.createElement("style");
		$$("head").appendChild(eleStyle);
		$$("#visa_search_input").addEventListener("input", function() {
			var val = this.value.trim().toLowerCase();
			if(val !== '') {
				eleStyle.innerHTML = '.search_list[data-index*="' + this.value + '"] { display:block; }';
			} else {
				eleStyle.innerHTML = '';
			}
		});

	}
})()