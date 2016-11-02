/**
 * Created by zhouzhiquan on 2016/10/14.
 */
// 样式引入
require('./../../skin/common/mgui.less');
require('./../../skin/page/calendar.less');
window.CONFIG = require('./../config.js'); // 配置文件，含：api接口信息，项目信�
window.mgui = require('./../lib/mgui/mgui.js');
require('./../lib/common.js');
require('./../lib/location.js');
require('./../lib/plugins/condition.js');
require('./../lib/plugins/msg.js');
(function($) {

	var paramsobj;
	var first = 0,
		index_1, index_2;

	function getweek(date) {
		var d = date.split("-");
		var weekday = new Array(7);
		weekday[0] = "周日";
		weekday[1] = "周一";
		weekday[2] = "周二";
		weekday[3] = "周三";
		weekday[4] = "周四";
		weekday[5] = "周五";
		weekday[6] = "周六";
		return weekday[new Date(parseInt(d[0]), parseInt(d[1]) - 1, parseInt(d[2])).getDay()];
	}
	/*获取当前农历*/
	function showCal(T) {
		var D = T;
		var yy = D.getFullYear();
		var mm = D.getMonth() + 1;
		var dd = D.getDate();
		var ww = D.getDay();
		var ss = parseInt(D.getTime() / 1000);
		if(yy < 100) yy = "19" + yy;
		return GetLunarDay(yy, mm, dd);
	}

	//定义全局变量 
	var CalendarData = new Array(100);
	var madd = new Array(12);
	var dayString = ["今", "明", "后"];
	var tgString = "甲乙丙丁戊己庚辛壬癸";
	var dzString = "子丑寅卯辰巳午未申酉戌亥";
	var numString = "一二三四五六七八九十";
	var monString = "正二三四五六七八九十冬腊";
	var weekString = "日一二三四五六";
	var cYear, cMonth, cDay, TheDate;
	CalendarData = new Array(0xA4B, 0x5164B, 0x6A5, 0x6D4, 0x415B5, 0x2B6, 0x957, 0x2092F, 0x497, 0x60C96, 0xD4A, 0xEA5, 0x50DA9, 0x5AD, 0x2B6, 0x3126E, 0x92E, 0x7192D, 0xC95, 0xD4A, 0x61B4A, 0xB55, 0x56A, 0x4155B, 0x25D, 0x92D, 0x2192B, 0xA95, 0x71695, 0x6CA, 0xB55, 0x50AB5, 0x4DA, 0xA5B, 0x30A57, 0x52B, 0x8152A, 0xE95, 0x6AA, 0x615AA, 0xAB5, 0x4B6, 0x414AE, 0xA57, 0x526, 0x31D26, 0xD95, 0x70B55, 0x56A, 0x96D, 0x5095D, 0x4AD, 0xA4D, 0x41A4D, 0xD25, 0x81AA5, 0xB54, 0xB6A, 0x612DA, 0x95B, 0x49B, 0x41497, 0xA4B, 0xA164B, 0x6A5, 0x6D4, 0x615B4, 0xAB6, 0x957, 0x5092F, 0x497, 0x64B, 0x30D4A, 0xEA5, 0x80D65, 0x5AC, 0xAB6, 0x5126D, 0x92E, 0xC96, 0x41A95, 0xD4A, 0xDA5, 0x20B55, 0x56A, 0x7155B, 0x25D, 0x92D, 0x5192B, 0xA95, 0xB4A, 0x416AA, 0xAD5, 0x90AB5, 0x4BA, 0xA5B, 0x60A57, 0x52B, 0xA93, 0x40E95);
	madd[0] = 0;
	madd[1] = 31;
	madd[2] = 59;
	madd[3] = 90;
	madd[4] = 120;
	madd[5] = 151;
	madd[6] = 181;
	madd[7] = 212;
	madd[8] = 243;
	madd[9] = 273;
	madd[10] = 304;
	madd[11] = 334;

	function GetBit(m, n) {
		return(m >> n) & 1;
	}
	//农历转换 
	function e2c() {
		TheDate = (arguments.length != 3) ? new Date() : new Date(arguments[0], arguments[1], arguments[2]);
		var total, m, n, k;
		var isEnd = false;
		var tmp = TheDate.getYear();
		if(tmp < 1900) {
			tmp += 1900;
		}
		total = (tmp - 1921) * 365 + Math.floor((tmp - 1921) / 4) + madd[TheDate.getMonth()] + TheDate.getDate() - 38;

		if(TheDate.getYear() % 4 == 0 && TheDate.getMonth() > 1) {
			total++;
		}
		for(m = 0;; m++) {
			k = (CalendarData[m] < 0xfff) ? 11 : 12;
			for(n = k; n >= 0; n--) {
				if(total <= 29 + GetBit(CalendarData[m], n)) {
					isEnd = true;
					break;
				}
				total = total - 29 - GetBit(CalendarData[m], n);
			}
			if(isEnd) break;
		}
		cYear = 1921 + m;
		cMonth = k - n + 1;
		cDay = total;
		if(k == 12) {
			if(cMonth == Math.floor(CalendarData[m] / 0x10000) + 1) {
				cMonth = 1 - cMonth;
			}
			if(cMonth > Math.floor(CalendarData[m] / 0x10000) + 1) {
				cMonth--;
			}
		}
	}

	function GetcDateString() {
		var tmp = "";
		/*显示农历年：（ 如：甲午(马)年 ）*/
		/*tmp+=tgString.charAt((cYear-4)%10); 
		tmp+=dzString.charAt((cYear-4)%12); 
		tmp+="("; 
		tmp+=sx.charAt((cYear-4)%12); 
		tmp+=")年 ";*/
		if(cMonth < 1) {
			tmp += "(闰)";
			tmp += monString.charAt(-cMonth - 1);
		} else {
			tmp += monString.charAt(cMonth - 1);
		}
		tmp += "月";
		tmp += (cDay < 11) ? "初" : ((cDay < 20) ? "十" : ((cDay < 30) ? "廿" : "三十"));
		if(cDay % 10 != 0 || cDay == 10) {
			tmp += numString.charAt((cDay - 1) % 10);
		}
		return tmp;
	}

	function GetLunarDay(solarYear, solarMonth, solarDay) {
		//solarYear = solarYear<1900?(1900+solarYear):solarYear; 
		if(solarYear < 1921 || solarYear > 2030) {
			return "";
		} else {
			solarMonth = (parseInt(solarMonth) > 0) ? (solarMonth - 1) : 11;
			e2c(solarYear, solarMonth, solarDay);
			return GetcDateString();
		}
	}

	function $$(ele) {
		return document.querySelector(ele)
	};

	function $on(ele, callback) {
		[].forEach.call(ele, function(el) {
			callback(el)
		});
	};

	function Index_Of(e, th) {

		for(var i = 0; i < e.length; i++) {
			if(e[i] == th) {
				return i
			}
		}
	};

	function festival(day, Lunar, j) {
		switch(day) {
			case "1-1":
				return "元旦";
			case "5-1":
				return "劳动节";
			case "10-1":
				return "国庆";
			case "2-14":
				return "情人节";
			case "4-4":
				return "清明";
			case "12-25":
				return "圣诞节";
			default:
				break;
		};
		switch(Lunar) {
			case "九月初九":
				return "重阳节";
			case "正月初一":
				return "春节";
			case "正月十五":
				return "元宵节";
			case "五月初五":
				return "端午节";
			case "八月十五日":
				return "中秋节";
			case "七月初七":
				return "七夕";
			default:
				break;
		}
		return j
	};

	//时间数据
	var td = {
		date: parseInt(new Date().getDate()),
		year: parseInt(new Date().getFullYear()),
		month: parseInt(new Date().getMonth())
	};
	//通用函数
	var F = {
		//计算某年某月有多少天
		getDaysInMonth: function(year, month) {
			return new Date(year, month + 1, 0).getDate();
		},
		//计算某月1号是星期几
		getWeekInMonth: function(year, month) {
			return new Date(year, month, 1).getDay();
		},
		getMonth: function(m) {
			return ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'][m];
		},
		//计算年某月的最后一天日期
		getLastDayInMonth: function(year, month) {
			return new Date(year, month, this.getDaysInMonth(year, month)).getDate();
		}
	};
	var mader = {
		init: function() {

			//			$.apiCaller.call({
			//				api: CONFIG.getApi('queryLowPrice'),
			//				showLoading: true, // 显示loading
			//				method: "POST",
			//				loadcfg: {
			//					msg: "加载列表.."
			//				}, // loading 消息配置
			//				data: {
			//					tripType: "OW",
			//					depCity: "SHA",
			//					arrCity: "PEK",
			//					startDate: "2016-11-22"
			//				}
			//			}, function(e) {
			//
			//			});
			this.initListeners()
		},
		getDateStr: function(y, m, d) {
			var dayStr = '';
			//计算1号是星期几，并补上上个月的末尾几天
			var week = F.getWeekInMonth(y, m);
			var MonthDays = F.getDaysInMonth(y, m);
			var startDay = td.date;
			if(y > td.year || m > td.month || d > td.date) {
				startDay = 1;
			};

			for(var j = week - 1; j >= 0; j--) {
				dayStr += '<li class="disabled"></li>';
			};
			for(var i = 1; i < startDay; i++) {
				dayStr += '<li class="disabled" data-day="' + y + "-" + ((m + 1) < 10 ? "0" + (m + 1) : (m + 1)) + "-" + (j < 10 ? "0" + j : j) + '"><span>' + festival((m + 1) + "-" + i, showCal(new Date(y, m, i)), i) + '</span><span></span></li>';
			};
			for(var j = startDay; j <= MonthDays; j++) {

				dayStr += '<li class="able day" data-date="' + y + "-" + ((m + 1) < 10 ? "0" + (m + 1) : (m + 1)) + "-" + (j < 10 ? "0" + j : j) + '" ><span>' + festival((m + 1) + "-" + j, showCal(new Date(y, m, j)), j) + '</span><span></span></li>';
			}
			return dayStr
		},
		initListeners: function() {
			var year = td.year,
				month = td.month - 1,
				day = td.date - 1;
			for(var i = 0; i < 12; i++) {
				month += 1;
				day += 1;
				if(month == 12) {
					month = 0;
					year++;
				};
				$$("#content").insertAdjacentHTML("beforeend", '<div class="md_panel"><div class="md_head" data-date="' + year + "-" + ((month + 1) < 10 ? "0" + (month + 1) : (month + 1)) + '">' + year + "年" + (month + 1) + "月" + '</div><div class="md_body"><ul class="md_weekarea" id=""><li>日</li><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li></ul><ul class="md_datearea in" id="md_datearea in">' + this.getDateStr(year, month, day) + '</ul></div></div>')
			};
			this.initinnerHTML()

			this.Event()
		},
		//绑定事件
		Event: function() {
			//点击选择日期
			$on(document.querySelectorAll('.able'), function(el) {
				el.addEventListener('click', function() {

					this.classList.add("able_bg");
					var that = this;

					//					var siblings = [].filter.call(document.querySelectorAll('.day'), function(child) {
					//						return child !== that
					//					});
					//					[].forEach.call(siblings, function(e) {
					//
					//						e.classList.remove("able_bg")
					//					})
					try {
						if(paramsobj.tagPage == "search.html") {
							if(paramsobj.tripType == "RT") {
								if(paramsobj.time == "end") {
									this.querySelector("span:last-child").innerHTML = "返回";
									paramsobj.endDateRT = this.getAttribute("data-date");
									setTimeout(function() {
										$.jumpTo('search.html', paramsobj);
									}, 500)

								} else {
									this.querySelector("span:last-child").innerHTML = "出发";
									paramsobj.startDateRT = this.getAttribute("data-date");
									setTimeout(function() {
										$.jumpTo('search.html', paramsobj);
									}, 500)
								}
							} else {
								this.querySelector("span:last-child").innerHTML = "出发";
								paramsobj.startDateOW = this.getAttribute("data-date");
								paramsobj.price = this.querySelector("span:last-child").innerHTML;
								setTimeout(function() {
									$.jumpTo('search.html', paramsobj);
								}, 500)
							}
						} else {
							paramsobj.price = this.querySelector("span:last-child").innerHTML;
							this.querySelector("span:last-child").innerHTML = "出发";
							paramsobj.startDateOW = this.getAttribute("data-date");

							setTimeout(function() {
								$.jumpTo('flightList.html', paramsobj);
							}, 500)
						}

					} catch(e) {

					}

				}, false);
			});
			//请求渲染价格
			try {
				if(paramsobj.tripType == "RT") {
					$.apiCaller.call({
						api: CONFIG.getApi('queryLowPrice'),
						showLoading: true, // 显示loading
						method: "POST",
						loadcfg: {
							msg: "加载列表.."
						}, // loading 消息配置
						data: {
							tripType: paramsobj.tripType,
							depCity: paramsobj.depCityIdRT,
							arrCity: paramsobj.arrCityIdRT,
							startDate: paramsobj.startDateRT
						}
					}, function(e) {

					});
				} else {
					$.apiCaller.call({
						api: CONFIG.getApi('queryLowPrice'),
						showLoading: true, // 显示loading
						method: "POST",
						loadcfg: {
							msg: "加载列表.."
						}, // loading 消息配置
						data: {
							tripType: paramsobj.tripType,
							depCity: paramsobj.depCityIdOW,
							arrCity: paramsobj.arrCityIdOW,
							startDate: paramsobj.startDateOW
						}
					}, function(e) {

					});
				}

			} catch(e) {
				console.log(e)
			}

		},
		initinnerHTML: function() {
			//显示今明后
			for(var i = 0; i < 3; i++) {
				document.querySelectorAll('.able')[i].querySelector("span").innerHTML = dayString[i];
			}

			try {
				if(paramsobj.tripType == "RT") {
					if(paramsobj.time == "end") {
						$on(document.querySelectorAll(".md_head"), function(e) {

							if(paramsobj.startDateRT.indexOf(e.getAttribute("data-date")) != -1) {
								e.setAttribute("id", paramsobj.startDateRT);
								location.hash = "#" + paramsobj.startDateRT;
							}
						})
						$on(document.querySelectorAll('.able'), function(e) {
							if(e.getAttribute("data-date") == paramsobj.startDateRT) {

								var indexof = Index_Of(document.querySelectorAll('.able'), e);
								console.log(indexof);
								for(var i = 0; i < indexof; i++) {
									document.querySelectorAll('.able')[i].classList.add("RT")
								}
								for(var j = 0; j < document.querySelectorAll(".RT").length; j++) {
									document.querySelectorAll(".RT")[j].classList.remove("able")
									document.querySelectorAll(".RT")[j].classList.add("disabled")
								}
							}
						})
						$$(".able").classList.add("able_bg")
						$$(".able span:last-child").innerHTML = "出发"
					}

				}

			} catch(e) {
				console.log(e)
			}
			//显示除夕
			$on(document.querySelectorAll('.able'), function(el) {
				if(el.querySelector("span").innerHTML == "春节") {
					document.querySelectorAll('.able')[Index_Of(document.querySelectorAll('.able'), el) - 1].querySelector("span").innerHTML = "除夕"
				}

			});

		}

	};
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
		mader.init();
	};
})(mgui);