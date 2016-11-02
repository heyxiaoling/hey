/**
 * Created by zhouzhiquan on 2016/10/19.
 */
// 样式引入
require('./../../skin/common/mgui.less');
require('./../../skin/page/searchCity.less');
require('./../../skin/common/plugins/msg.less');
window.CONFIG = require('./../config.js'); // 配置文件，含：api接口信息，项目信�
window.mgui = require('./../lib/mgui/mgui.js'); // mgui主框�
window.mgui.template = require('./../lib/template.js');
require('./../lib/common.js');
require('./../lib/location.js');
require('./../lib/plugins/condition.js');
require('./../lib/plugins/msg.js');
(function($) {
	function getArray(a) {
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

	function $$(ele) {
		return document.querySelector(ele)
	};

	function $on(ele, callback) {
		[].forEach.call(ele, function(el) {
			callback(el)
		});
	};
	var paramsobj;
	var firstfontarry = [];
	var city_data;
	var searchCity = {
		init: function() {
			//最近访问
			try {
				if(!($.localStorageUtil.getLocalStorage("city"))) {
					city_data = {
						countryid: [],
						cityid: []
					};
				} else {
					city_data = JSON.parse($.localStorageUtil.getLocalStorage("city"));
					city_data.countryid = getArray(city_data.countryid);
					city_data.cityid = getArray(city_data.cityid);
					$.localStorageUtil.setLocalStorage("city", JSON.stringify(city_data));
					city_data = JSON.parse($.localStorageUtil.getLocalStorage("city"));
					try {
						$$("#HistoryCitynone").remove();
					} catch(e) {

					}

					for(var i = 0; i < city_data.countryid.length; i++) {
						if(i > 2) {
							break
						}
						$$("#HistoryCity").insertAdjacentHTML("beforeend", '<div class="mg-btn btn-sm btn-radius-uncheck able" cityId="' + city_data.cityid[i] + '">' + unescape(city_data.countryid[i]) + '</div>')
					}
				}
			} catch(e) {
				console.log(e)
			}

			//城市定位
			$.getLocation(function(data) {
				$$("#Current_City").insertAdjacentHTML("beforeend", data)
			});
			var that = this;
			//请求城市列表数据
			$.apiCaller.call({
				api: CONFIG.getApi('getFlightCities'),
				showLoading: true, // 显示loading
				method: "POST",
				loadcfg: {
					msg: "加载列表.."
				}, // loading 消息配置
				data: {}
			}, function(data) {
				var numb = 0;
				for(var i = 1; i < data.data.flightCity.length; i++) {
					if(data.data.flightCity[i].cityDetailDatas.length == 0) {
						continue
					};
					$$("#dest_list").insertAdjacentHTML("beforeend", '<li class="dest_list_content" id="' + data.data.flightCity[i].firstLetter + '"><h3 class="dest_list_title">' + data.data.flightCity[i].firstLetter + '</h3><div class="dest_choose_letter"></div></li>');
					firstfontarry.push(data.data.flightCity[i].firstLetter)
					$$("#body_content_fixed").insertAdjacentHTML("beforeend", "<span>" + data.data.flightCity[i].firstLetter + "</span>")
					for(var j = 0; j < data.data.flightCity[i].cityDetailDatas.length; j++) {
						var cityDetailDatas = data.data.flightCity[i].cityDetailDatas[j];
						$$("#search_list").insertAdjacentHTML("beforeend", '<div class="search_list able" data-index="' + cityDetailDatas.cityName + "-" + cityDetailDatas.abbreviation + "-" + cityDetailDatas.citySpell + '"  cityId="' + cityDetailDatas.cityId + '">' + cityDetailDatas.cityName + '</div>')
						document.querySelectorAll(".dest_choose_letter")[numb].insertAdjacentHTML("beforeend", "<a class='able' cityId=" + cityDetailDatas.cityId + ">" + cityDetailDatas.cityName + "</a>")
					}
					numb++;
				};
				for(var i = 0; i < data.data.flightCity[0].cityDetailDatas.length; i++) {
					$$("#HotCity").insertAdjacentHTML("beforeend", '<div class="mg-btn btn-sm btn-radius-uncheck able" cityId="' + data.data.flightCity[0].cityDetailDatas[i].cityId + '">' + data.data.flightCity[0].cityDetailDatas[i].cityName + '</div>')
				}

				that.bindevent()
			});
		},
		bindevent: function() {
			//搜索
			var eleStyle = document.createElement("style");
			$$("head").appendChild(eleStyle);
			$$("#search_input_city").addEventListener("input", function() {
				var val = this.value.trim().toLowerCase();
				if(val !== '') {
					eleStyle.innerHTML = '.search_list[data-index*="' + this.value.toUpperCase() + '"] { display:block !important; }';
				} else {
					eleStyle.innerHTML = '';
				}
			});
			//右侧滑动事件
			var hot_top = parseInt($$("#body_content_fixed").offsetTop);
			var event_str = 'if(touch.clientY>' + hot_top + '&&touch.clientY<' + (hot_top += 18) + '){location.hash="#CurrentCity"}else if(touch.clientY>' + (hot_top) + '&&touch.clientY<' + (hot_top += 18) + ') {location.hash="#HotCity"}'
			for(var i = 0; i < firstfontarry.length; i++) {
				event_str += 'else if(touch.clientY>' + (hot_top) + '&&touch.clientY<' + (hot_top += 18) + ') {location.hash="#' + firstfontarry[i] + '"}'
			};
			$$("#body_content_fixed").addEventListener("touchmove", function(e) {
				e.preventDefault()
				var touch = e.targetTouches[0];
				eval(event_str)
			});
			//点击跳转
			$on(document.querySelectorAll("#body_content_fixed span"), function(e) {
				e.addEventListener("touchstart", function() {
					location.hash = "#" + this.innerHTML + ""
				})
			});
			//保存点击和跳转
			$on(document.querySelectorAll(".able"), function(e) {
				e.addEventListener("click", function() {
					city_data.countryid.unshift(escape(this.innerHTML));
					city_data.cityid.unshift(this.getAttribute("cityid"));
					$.localStorageUtil.setLocalStorage("city", JSON.stringify(city_data))
					try {
						if(paramsobj.tripType == "RT") {
							if(paramsobj.city == "dep") {
								paramsobj.depCityCityNameRT = this.innerHTML;
								paramsobj.depCityIdRT = this.getAttribute("cityid");
								$.jumpTo('search.html', paramsobj);

							} else {
								paramsobj.arrCityCityNameRT = this.innerHTML;
								paramsobj.arrCityIdRT = this.getAttribute("cityid");
								$.jumpTo('search.html', paramsobj);

							}
						} else {
							if(paramsobj.city == "dep") {
								paramsobj.depCityCityNameOW = this.innerHTML;
								paramsobj.depCityIdOW = this.getAttribute("cityid");
								$.jumpTo('search.html', paramsobj);
							} else {
								paramsobj.arrCityCityNameOW = this.innerHTML;
								paramsobj.arrCityIdOW = this.getAttribute("cityid");
								$.jumpTo('search.html', paramsobj);
							}

						}
					} catch(e) {

					}
				})
			})

		}
	}
	window.onload = function() {
		$.onRecvData = function(inData) {
			var data = {
				tripType: 'OW', //OW单程，RT往返程  //默认单程
				startDateOW: "", //出发时间
				startDateRT: "", //双程出发时间
				endDateRT: '', //返回时间
				depCityIdOW: 'SZX', // 出发城市三字码  //默认深圳
				depCityIdRT: 'SZX',
				arrCityIdOW: '', // 到达城市三字码
				arrCityIdRT: "",
				depCityCityNameOW: '深圳', // 出发城市名称  //默认深圳
				depCityCityNameRT: "",
				arrCityCityNameOW: "",
				arrCityCityNameRT: '', // 到达城市名称
				city: 'dep', // dep 出发城市 arr 到达城市 //默认出发城市
				time: 'start', //  start出发时间 end到达时间 //默认出发时间
				price: '',
				tagPage: "search.html"

			}
			paramsobj = $.extend(data, inData);
			console.log(paramsobj)
			searchCity.init();
		};

	}
})(mgui)