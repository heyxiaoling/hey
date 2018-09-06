(function () {
    var s = '<div class="footer">'
    + '<div class="nav_bg"></div>'
    + '<div class="nav"><div class="nav_wrap"><ul id="menu"> <li><a href="index.html"><div class="nav_e">HOME</div><div class="nav_c">首  页</div></a><li><a href="page1_1.html"><div class="nav_e">HOMETOWN</div><div class="nav_c">都市原乡</div></a><ul style="left:128px;"><li><a href="page1_1.html">跨界广惠</a></li><li><a href="page1_2.html">迅捷交通</a></li><li><a href="page2_8.html">周边配套</a></li><li><a href="page1_3.html">品牌传承</a></li><li><a href="page1_4.html">电子沙盘</a></li><li><a href="page1_5.html">乡墅未来</a></li><li><a href="page1_6.html">旅游贴士</a></li></ul></li>'
    + '<li><a href="page2_1.html"><div class="nav_e">COUNTRY VILLA</div><div class="nav_c">振业乡墅</div></a><ul style="left:328px;"><li><a href="page2_1.html">项目概况</a></li><li><a href="page2_2.aspx">园林景观</a></li><li><a href="page2_3.html">独栋别墅</a></li><li><a href="page2_7.html">类独栋别墅</a></li><li><a href="page2_4.html">双拼别墅</a></li><li><a href="javascript:;" id="to360"  onclick="getExplorer()">360样板房</a></li><li><a href="page2_6.html">考工细鉴</a></li></ul></li>'
    +'<li><a href="page3.html"><div class="nav_e">CUSTOM</div><div class="nav_c">定制之享</div></a><ul style="left:528px;"><li><a href="page3_1.html">SPA会所</a></li><li><a href="page3_2.html">养生养疗</a></li><li><a href="page3_3.html">风情商业</a></li><li><a href="page3_4.html">贵族教育</a></li><li><a href="page3_5.html">振业物业</a></li></ul></li><li><a href="page4_0.html"><div class="nav_e">BIG RAISE</div><div class="nav_c">大养之境</div></a><ul style="left:448px"><li><a href="page4_1.html">原生山林</a></li><li><a href="page4_2.html">天鹅湖</a></li><li><a href="page4_3.html">库区休闲</a></li><li><a href="page4_4.html">闲庭大院</a></li><li><a href="page4_5.html">有氧健身</a></li></ul></li><li><a href="page5_1.aspx"><div class="nav_e">NEWS</div><div class="nav_c">媒体资讯</div></a><ul style="left:433px;"><li><a href="page5_1.aspx">媒体报道</a></li><li><a href="page5_2.aspx">销售中心</a></li><li><a href="page5_3.aspx">公益活动</a></li><li><a href="page5_4.aspx">活动专区</a></li><li><a href="login.aspx?urls=page5_5.aspx">业主分享</a></li><li><a href="login.aspx?urls=page5_6.aspx">物业论坛</a></li><li><a href="page5_7.aspx">电子书刊</a></li><li><a href="page5_8.aspx">视频欣赏</a></li></ul></li></ul></div></div>'
    + '<div class="copyright">开发商：惠州市惠阳区振业创新发展有限公司&nbsp&nbsp&nbsp&nbsp 地址：惠阳区惠南大道惠阳振业城&nbsp&nbsp&nbsp&nbsp 整合机构：拨浪鼓网络资源整合服务机构 '
    + '<div class="music" id="music" name="play"><audio src="music/music.mp3"  autoplay="autoplay" ></audio><div class="ren_s"></div></div></div></div>';
    document.write(s);

    function mainNav() {
        var amenu = $('#menu');

        var aNav = $('#menu>li');
        var timer = null, n = 0;
        var subNav = null;
        aNav.find('>a').each(function (i, docEle) {
            $(docEle).html('<span class="over">' + $(docEle).html() + '</span><span class="out">' + $(docEle).html() + '</span>');
        });
        amenu.hover(function () {

        }, function () {
            $(".nav_bg").stop().animate({
                top: "50px"
            }, 200);
        });
        aNav.hover(function () {
            $(".out", this).stop().animate({ 'top': '38px' }, 200); // 向下滑动 - 隐藏
            $(".over", this).show().stop().animate({ 'top': '0px' }, 200); // 向下滑动 - 显示
            subNav = $(this).find('li');
            $(".nav_bg").stop().animate({
            top:'20px'
            },200);
            subNav.css({ opacity: 0, bottom: -30 });
            navMove();
        }, function () {
            $(".out", this).stop().animate({ 'top': '0px' }, 200); // 向上滑动 - 显示
            $(".over", this).hide().stop().animate({ 'top': '-38px' }, 200); // 向上滑动 - 隐藏

            subNav.stop();
        });
        function navMove() {
            subNav.eq(n).stop().animate({ bottom: 0, opacity: 1 }, 500);
            n++;
            timer = setTimeout(navMove, 100);
            if (n >= subNav.length) {
                n = 0;
                clearTimeout(timer);
            }
        }
    }
    $(function () {
        mainNav();
    })
})()


//背景音乐
audioMusic();
function audioMusic() {
    var omusic = $('#music');
    getExplorers();
    function getExplorers() {
        var explorer = window.navigator.userAgent;
        if (explorer.indexOf("MSIE") >= 0) {
            omusic.hide();
        }
        else {
            omusic.show();
        }
    }
    omusic.click(function () {
        var oaudio = $(this).find('audio')[0];
        var omusic = $(this);
        var oname = $(this).attr('name');
        var oline = $(this).find('.ren_s');
        if (oname == "stop") {
            oaudio.play();
            omusic.attr("name", "play");
            oline.hide();
        } else {
            oaudio.pause();
            omusic.attr("name", "stop");
            oline.show();
        }
    })
}


function getExplorer() {
    function browserRedirect() {
        var ua = navigator.userAgent.toLowerCase();
        var bIsIpad = ua.match(/ipad/i) == "ipad";
        var bIsIphoneOs = ua.match(/iphone os/i) == "iphone os";
        var bIsMidp = ua.match(/midp/i) == "midp";
        var bIsUc7 = ua.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = ua.match(/ucweb/i) == "ucweb";
        var bIsAndroid = ua.match(/android/i) == "android";
        var bIsCE = ua.match(/windows ce/i) == "windows ce";
        var bIsWM = ua.match(/windows mobile/i) == "windows mobile";
        if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
            window.location.href = "360html/a1/index.html";
        }
        else {
            window.location.href = "360html2/a1/index.html";
        }
    }
    browserRedirect();
}


        
  
      