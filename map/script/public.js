jQuery.fn.extend({
    listScroll: function (x, num, auto) {
        if (auto == null || auto == undefined) auto = true;
        this.each(function (index, docEle) {
            //x 每次移动的距离
            //num=5 显示对象的个数
            var iNow = 0, logic = false, timer;
            var m_box = $('.js_move', docEle)
            var m_ul = $('.js_move ul', docEle);
            var m_li = $('.js_move li', docEle);
            var prev = $('.js_prev', docEle)
            var next = $('.js_next', docEle)
            var xnum = m_li.length - num;
            m_ul.height((m_li.length) * x);
            if (xnum <= 0) {
                prev.hide();
                next.hide();
                return;
            } //长度不够不执行动画
            m_box.append(m_ul.clone(false)); //克隆ul列表添加到运动盒子（m_box）里面
            var wf_ul = $('.js_move ul:last', docEle); //获取克隆的列表
            wf_ul.css({ position: 'absolute', top: m_ul.outerHeight(), left: 0 });
            prev.click(function () {
                if (logic) return;
                iNow--;
                move();
            });
            next.click(function () {
                if (logic) return;
                iNow++;
                move();
            });
            //基本运动函数
            var move = function () {
                logic = true;
                if (iNow == -1)
                    wf_ul.css('top', -m_ul.outerHeight());
                if (iNow == xnum)
                    wf_ul.css('top', m_ul.outerHeight());
                m_box.stop().animate({ top: -iNow * x }, 'slow', function () {
                    if (iNow >= (xnum + num)) {
                        m_box.css('top', 0);
                        iNow = 0;
                    }
                    if (iNow <= -num) {
                        m_box.css('top', -xnum * x);
                        iNow = xnum
                    }
                    logic = false;
                });
            };
            //自动运行判断参数auto
            if (auto) {
                clearInterval(timer);
                timer = setInterval(function () {
                    iNow++; move();
                }, 6000);
                $(docEle).hover(function () {
                    clearInterval(timer);
                }, function () {
                    clearInterval(timer);
                    timer = setInterval(function () {
                        iNow++; move();
                    }, 6000);
                });
            }
        })
    },
    imgScroll: function (x, nj) {
        if (nj == undefined) var nj = true;
        this.each(function (index, docEle) {
            var iNow = 0, iLast = 0, fx = 1, timer, logic = true, html;
            var mLi = $('.m_ul li', docEle);
            var bUl = $('.btn_ul', docEle);
            var bUl2 = $('.btn_ul2', docEle);
            var pre = $('.pre', docEle);
            var next = $('.next', docEle);
            var _length = mLi.length;
            //添加小点
            if (bUl != null || bUl != undefined) {
                for (var i = 0; i < _length; i++) {
                    if (html)
                        html += '<li></li>';
                    else
                        html = '<li></li>';
                }
                bUl.html(html);
            }

            if (bUl2 != null || bUl2 != undefined) {
                for (var i = 0; i < _length; i++) {
                    if (html)
                        html += '<li></li>';
                    else
                        html = '<li></li>';
                }
                bUl2.html(html);
            }

            var bLi = $('.btn_ul li', docEle);
            var bLi2 = $('.btn_ul2 li', docEle);
            mLi.eq(iNow).css({ left: 0 });
            bLi.eq(iNow).addClass('on');
            bLi2.eq(iNow).addClass('on');
            if (_length <= 1) return;
            var move = function () {
                if (iNow == iLast) return;
                logic = false;
                if (iNow < iLast)
                    fx = -1;
                else
                    fx = 1;
                if (iNow >= _length) iNow = 0;
                if (iNow < 0) iNow = _length - 1;
                mLi.eq(iNow).css({ left: x * fx });
                mLi.eq(iNow).stop().animate({ left: 0 }, 'slow', function () { logic = true; });
                mLi.eq(iLast).stop().animate({ left: -x * fx }, 'slow');
                bLi.removeClass('on');
                bLi.eq(iNow).addClass('on');
                fx = 1;

            }
            pre.click(function () {
                if (logic) {
                    iLast = iNow;
                    iNow--;
                    move();
                }
            })
            next.click(function () {
                if (logic) {
                    iLast = iNow;
                    iNow++;
                    move();
                }
            })
            bUl.delegate('li', 'click', function () {
                if (logic) {
                    iLast = iNow;
                    iNow = $(this).index();
                    move();
                }
            });
            if (nj) {
                timer = setInterval(function () {
                    iLast = iNow;
                    iNow++;
                    move();
                }, 5000);
                $('.pre,.next,ul:last li', docEle).hover(function () {
                    clearInterval(timer);
                }, function () {
                    clearInterval(timer);
                    timer = setInterval(function () {
                        iLast = iNow;
                        iNow++;
                        move();
                    }, 5000);
                })
            }
        })
    },
    listScroll2: function (x, num, auto) {
        if (auto == null || auto == undefined) auto = true;
        this.each(function (index, docEle) {
            //x 每次移动的距离
            //num=5 显示对象的个数
            var iNow = 0, logic = false, timer, offsetT = -35;
            var m_box = $('.js_move', docEle);
            var m_ul = $('.js_move ul', docEle);
            var m_li = $('.js_move li', docEle);
            var prev = $('.js_prev', docEle)
            var next = $('.js_next', docEle)
            var xnum = m_li.length - num;
            m_ul.width((m_li.length) * x);
            if (xnum <= 0) {
                prev.hide();
                next.hide();
                return;
            } //长度不够不执行动画
            m_box.append(m_ul.clone(false)); //克隆ul列表添加到运动盒子（m_box）里面
            var wf_ul = $('.js_move ul:last', docEle); //获取克隆的列表
            var allLi = $('.js_move li', docEle); //所有li
            wf_ul.css({ position: 'absolute', left: m_ul.outerWidth(), top: 0 });
            allLi.eq(iNow + 1).stop().animate({ top: offsetT }, 'slow');
            prev.click(function () {
                if (logic) return;
                iNow--;
                move();
            });
            next.click(function () {
                if (logic) return;
                iNow++;
                move();
            });
            //基本运动函数
            var move = function () {
                logic = true;
                if (iNow == -1)
                    wf_ul.css('left', -m_ul.outerWidth());
                if (iNow == xnum)
                    wf_ul.css('left', m_ul.outerWidth());
                m_box.stop().animate({ left: -iNow * x }, 'slow', function () {
                    if (iNow >= (xnum + num)) {
                        m_box.css('left', 0);
                        iNow = 0;
                        allLi.stop();
                        allLi.eq(iNow + 1).css('top', offsetT);
                    }
                    if (iNow <= -num) {
                        m_box.css('left', -xnum * x);
                        iNow = xnum;
                        allLi.stop();
                        allLi.eq(iNow + 1).css('top', offsetT);
                    }
                    logic = false;
                });
                allLi.stop().animate({ top: 0 }, 'slow');
                allLi.eq(iNow + 1).stop().animate({ top: offsetT }, 'slow');
            };
            //自动运行判断参数auto
            if (auto) {
                clearInterval(timer);
                timer = setInterval(function () {
                    iNow++; move();
                }, 6000);
                $(docEle).hover(function () {
                    clearInterval(timer);
                }, function () {
                    clearInterval(timer);
                    timer = setInterval(function () {
                        iNow++; move();
                    }, 6000);
                });
            }
        })
    },
    listScroll3: function (x, num, auto) {
        if (auto == null || auto == undefined) auto = true;
        this.each(function (index, docEle) {
            //x 每次移动的距离
            //num=5 显示对象的个数
            var iNow = 0, logic = false, timer;
            var m_box = $('.js_move', docEle)
            var m_ul = $('.js_move ul', docEle);
            var m_li = $('.js_move li', docEle);
            var prev = $('.js_prev', docEle)
            var next = $('.js_next', docEle)
            var xnum = m_li.length - num;
            m_ul.width((m_li.length) * x);
            if (xnum <= 0) {
                prev.hide();
                next.hide();
                return;
            } //长度不够不执行动画
            m_box.append(m_ul.clone(false)); //克隆ul列表添加到运动盒子（m_box）里面
            var wf_ul = $('.js_move ul:last', docEle); //获取克隆的列表
            wf_ul.css({ position: 'absolute', left: m_ul.outerWidth(), top: 0 });
            prev.click(function () {
                if (logic) return;
                iNow--;
                move();
            });
            next.click(function () {
                if (logic) return;
                iNow++;
                move();
            });
            //基本运动函数
            var move = function () {
                logic = true;
                if (iNow == -1)
                    wf_ul.css('left', -m_ul.outerWidth());
                if (iNow == xnum)
                    wf_ul.css('left', m_ul.outerWidth());
                m_box.stop().animate({ left: -iNow * x }, 'slow', function () {
                    if (iNow >= (xnum + num)) {
                        m_box.css('left', 0);
                        iNow = 0;
                    }
                    if (iNow <= -num) {
                        m_box.css('left', -xnum * x);
                        iNow = xnum
                    }
                    logic = false;
                });
            };
            //自动运行判断参数auto
            if (auto) {
                clearInterval(timer);
                timer = setInterval(function () {
                    iNow++; move();
                }, 6000);
                m_box.hover(function () {
                    clearInterval(timer);
                }, function () {
                    clearInterval(timer);
                    timer = setInterval(function () {
                        iNow++; move();
                    }, 6000);
                });
            }
        })
    },
    imgResize: function () {
        //图片等比缩放(裁剪)
        this.each(function (index, docEle) {
            $(docEle).removeAttr('height').removeAttr('width').removeAttr('style'); //初始化
            var w = $(docEle).parent().width();
            var h = $(docEle).parent().height();
            if (docEle.width / docEle.height < w / h) {
                docEle.width = w;
                docEle.style.marginTop = -(docEle.height - h) / 2 + 'px';
            }
            else {
                docEle.height = h;
                docEle.style.marginLeft = -(docEle.width - w) / 2 + 'px';
            }
        })
    },
    swith: function () {
        this.each(function (i, docEle) {
            var btn = $('.js_btn', docEle);
            var dis = $('.js_dis', docEle);
            var iNow = 0;
            btn.click(function () {
                iNow = btn.index(this);
                if (dis.eq(iNow).css('display') == 'none')
                    dis.eq(iNow).show();
                else
                    dis.eq(iNow).hide();
            });
        });
    },
    houseMove: function (a,b) {
        //臻美户型
        this.each(function (index, docEle) {
            var wrap = $(docEle);
            var popupBtn = $('.js_popupBtn', docEle);
            var colse = $('.guan', docEle);
            var aHxBtn = $('.js_hxBtn a', docEle);
            var aLcBtn = $('.js_lcBtn a', docEle);
            var aHxBox = $('.zhenmei', docEle);
            var x = $(window).width(); //全局屏幕宽度
            function mainScroll() {
                var iNow = 0, iLast = 0, fx = 1, logic = true;
                var _length = aHxBox.length;
                aHxBox.eq(iNow).css({ left: 0 });
                aHxBtn.eq(iNow).addClass('atthis');
                aLcBtn.eq(3).show();
                if (index == 1) {
                    aLcBtn.eq(3).find('span').html('屋 顶');
                }
                else {
                    aLcBtn.eq(3).find('span').html('三 层');
                }
                if (index == 1 && (iNow == 3 || iNow == 5 || iNow == 6 || iNow == 7 || iNow == 11 || iNow == 12))
                    aLcBtn.eq(3).find('span').html('三 层');
                if (index == 0 && iNow == 0 && !a && !b)
                    aLcBtn.eq(3).hide();
                if (a)
                    aLcBtn.eq(3).find('span').html('屋 顶');
                if (_length <= 1) return;
                var move = function () {
                    if (iNow == iLast) return;
                    logic = false;
                    if (iNow < iLast)
                        fx = -1;
                    else
                        fx = 1;
                    if (iNow >= _length) iNow = 0;
                    if (iNow < 0) iNow = _length - 1;
                    aLcBtn.eq(3).show();
                    if (index == 0 && iNow == 0 && !a && !b)
                        aLcBtn.eq(3).hide();
                    if (index == 1) {
                        aLcBtn.eq(3).find('span').html('屋 顶');
                    }
                    else {
                        aLcBtn.eq(3).find('span').html('三 层');
                    }
                    if (index == 1 && (iNow == 3 || iNow == 5 || iNow == 6 || iNow == 7 || iNow == 11 || iNow == 12))
                        aLcBtn.eq(3).find('span').html('三 层');
                    if (a)
                        aLcBtn.eq(3).find('span').html('三 层');
                    if (a && (iNow == 0 || iNow == 1 || iNow == 2 || iNow == 4 || iNow == 8 || iNow == 9 || iNow == 10))
                        aLcBtn.eq(3).find('span').html('屋 顶');
                    aHxBox.eq(iNow).css({ left: x * fx });
                    aHxBox.eq(iNow).stop().animate({ left: 0 }, 'slow', function () { logic = true; });
                    aHxBox.eq(iLast).stop().animate({ left: -x * fx }, 'slow');
                    aHxBtn.removeClass('atthis');
                    aHxBtn.eq(iNow).addClass('atthis');
                    fx = 1;
                }
                aHxBtn.click(function () {
                    if (logic) {
                        iLast = iNow;
                        iNow = aHxBtn.index(this);
                        loadImg(aHxBox.eq(iNow).find('div img')[0]);
                        move();
                        alphaMove(aHxBox.eq(iNow).find('div'));
                    }
                });
                loadImg(aHxBox.eq(iNow).find('div img')[0]);
                alphaMove(aHxBox.eq(iNow).find('div'));
                $(window).resize(function () {
                    x = $(window).width();
                    aHxBox.css('left', x);
                    aHxBox.eq(iNow).css('left', 0);
                });
            }
            function alphaMove(group) {
                var aHxImg = group;
                var _length = aHxImg.length;
                var z = _length;
                var iNow = 0, iLast = 0;
                aHxImg.attr('style', '');
                aHxImg.eq(iNow).css('zIndex', z);
                aLcBtn.removeClass('atthis2');
                aLcBtn.eq(iNow).addClass('atthis2');
                aLcBtn.click(function () {
                    z++;
                    iLast = iNow;
                    iNow = $(this).index();
                    aLcBtn.removeClass('atthis2');
                    aLcBtn.eq(iNow).addClass('atthis2');
                    loadImg(aHxImg.find('img')[iNow]);
                    if (iNow == iLast) return;
                    aHxImg.eq(iNow).css({ opacity: 0, zIndex: z }).stop().animate({ opacity: 1 }, 'slow');
                });
            }
            function loadImg(obj) {
                //img load
                if (obj.src != $(obj).attr('data_src'));
                obj.src = $(obj).attr('data_src');
            }
            mainScroll();
            popupBtn.click(function () {
                $('body,html').css({ width: '100%', height: '100%', overflow: 'hidden' });
                autoSize();
                wrap.css('left', '100%').show().stop().animate({ left: 0 }, 'slow');
            });
            colse.click(function () {
                wrap.stop().animate({ left: -x }, 'slow', function () {
                    $('body,html').attr('style', '');
                    autoSize();
                    wrap.hide();
                });
            });
        });
    }

});
function swith2() {
    var dis = $('#upload');
    if ($('#hfild').val() == '1')
        dis.show();
    else
        dis.hide();
     $('#uploadbtn').click(function () {
        if (dis.css('display') == 'none')
            dis.show();
        else
            dis.hide();
    });
    $('#xxbtn').click(function () {
        dis.hide();
    }
    );
}
function boxmove() {
var speed = 50 //调整滚动速度
var maq = document.getElementById('maq');
var mtext = document.getElementById('mtext');
var m0 = document.getElementById('m0');
    m0.innerHTML = mtext.innerHTML;
function Marquee() {
    if (m0.offsetTop - maq.scrollTop <= 0) {
        maq.scrollTop -= mtext.offsetHeight;
    }
    else {
        maq.scrollTop++
    }
}
var MyMar = setInterval(Marquee, speed)
maq.onmouseover = function () { clearInterval(MyMar) }
maq.onmouseout = function () { MyMar = setInterval(Marquee, speed) }
}
/*
页面动画部分
*/
function flexCon() {
    var bH = 466, iH = 25, timer;
    var box = $('#flexBox');
    box.find('.flexSwitch').click(function () {
        if (box.height() <= 25) {
            $(this).removeClass('flexSwitchOn');
            box.stop().animate({ height: bH }, 'slow');
        }
        else {
            $(this).addClass('flexSwitchOn');
            box.stop().animate({ height: iH }, 'slow');
        }
    });
    clearInterval(timer);
    timer=setTimeout(function () {
        box.find('.flexSwitch').addClass('flexSwitchOn');
        box.stop().animate({ height: iH }, 'slow');
    }, 5000);
    box.hover(function () {
        clearInterval(timer);
    }, function () {
        timer = setTimeout(function () {
            box.find('.flexSwitch').addClass('flexSwitchOn');
            box.stop().animate({ height: iH }, 'slow');
        }, 5000);    
    });
}
function autoSize() {
    var wrap = $('#wrapper');
    var minW = 980, minH = 750, w, h;
    function change() {
        w = $(window).width();
        h = $(window).height();
        if (w < minW)
            w = minW;
        if (h < minH)
            h = minH;
        wrap.css({ width: w, height: h });
        $('#bigbg img').imgResize();
    }
    change();
    $(window).resize(change);
    $('.imgScroll').hover(function () {
        $('.pre').show();
        $('.next').show();
    }, function () {
        $('.pre').hide();
        $('.next').hide();
    });
}
function dzMap() {
    //电子地图动画
    var wrap = $('#js_dzMap');
    var aLine = $('#js_dzMap .js_line');
    var aText = $('#js_dzMap .dz_text');
    var aBtn = $('#js_dzMap .dz_btn span');
    var iNow = 0;
    var size = [['width',315],['height',294]];
    function move() {
        aLine.each(function (index, docEle) {
            $(docEle).stop().css(size[index][0],0);
        });
        aText.hide();
        if (size[iNow][0] == 'width') {
            aLine.eq(iNow).stop().animate({ width: size[iNow][1] }, 1200, function () {
                aText.eq(iNow).fadeIn('slow');
            });
        }
        else {
            aLine.eq(iNow).stop().animate({ height: size[iNow][1] }, 1200, function () {
                aText.eq(iNow).fadeIn('slow');
            });
        }
    }
    aBtn.click(function () {
        iNow = aBtn.index(this);
        move();
    });
    $('#js_dzMap .dz_colse').click(function () {
        wrap.stop().animate({left:-1600},'slow');
    });
    $('#js_dzMapOpen').click(function () {
        wrap.css('left', '100%').stop().animate({ left: 0 }, 'slow', function () {
            move();
        });
    });      ;
}
//定制之亨
function pageR() {
    var apage = $('.page3_r');
    apage.stop(true, true).animate({
        right: '-88px'
    }, 500);
}










