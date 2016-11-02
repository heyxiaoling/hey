/**
 * Created by zhuyu on 2016/10/10.
 *
 */
(function($){
    /*
        <div class="tab">
            <div className="tab-title">
                <ul>
                    <li class="tab-title-slide">title1</li>
                    <li class="tab-title-slide">title2</li>
                    <li class="tab-title-slide">title3</li>
                </ul>
            </div>
            <div className="tab-wrapper">
                <div className="tab-slide">aaa</div>
                <div className="tab-slide">aaa</div>
                <div className="tab-slide">aaa</div>
            </div>
        </div>
     */
    var Tab = function(container,params){
        if (!(this instanceof Tab)) return new Tab(container, params);

        this.defaults = {
            initialSlide: 0,
            speed: 300,
            // autoplay
            autoplay: false,
            initSlideNumber: 1,
            contentSlideClass: 'mg-tab-slide',
            slideActiveClass: 'mg-tab-slide-active',
            slideVisibleClass: 'mg-tab-slide-visible',
            slideNextClass: 'mg-tab-slide-next',
            slidePrevClass: 'mg-tab-slide-prev',
            wrapperClass: 'mg-tab-wrapper',
            titleSlideClass: 'mg-tab-title-slide',
            titleActiveClass: 'mg-tab-title-slide-active',
            callback: function(){},
            onTitleChange: function(){},
            onSlideChange: function(){},
            onSlideChangeStart: function (swiper){},
            onSlideChangeEnd: function (swiper){},
        };


        $.extend(true,this.defaults,params);

        var t = this;
        
        t.container = $(container)[0];

        if(!t.container){
            $.msg({
                type:'alert',
                text: container + '没有找到'
            });
            
            return false;
        }    
        t.titleSlide = t.container.querySelectorAll('.' + t.defaults.titleSlideClass);
        t.contentWrapper = t.container.querySelectorAll('.' + t.defaults.wrapperClass)[0]; 
        t.contentSlide = t.contentWrapper.querySelectorAll('.' + t.defaults.contentSlideClass);
        
        t.init();

        if(this.defaults.callback) this.defaults.callback.call(this);
    }

    Tab.prototype = {
        constructor: Tab,
        init: function(){
            var t = this;
            var l = t.titleSlide.length;

            for(var i = 0; i < l; i++){
                t.contentSlide[i].style.display = 'none';
                $(t.titleSlide).eq(i).removeClass(t.defaults.titleActiveClass);
                (function a(i){
                    t.titleSlide[i].onclick=function(){
                        for(var j= 0; j < l; j++){
                            t.contentSlide[j].style.display = 'none';
                            $(t.titleSlide).eq(j).removeClass(t.defaults.titleActiveClass);
                            $(t.contentSlide).eq(j).removeClass(t.defaults.slideActiveClass);
                        }
                        t.onTitleChange(i,t.defaults.onTitleChange);
                        t.onSlideChange(i,t.defaults.onSlideChange);
                        
                    };
                })(i)
            }
            $(t.titleSlide).eq(t.defaults.initialSlide).addClass(t.defaults.titleActiveClass);
            t.contentSlide[t.defaults.initialSlide].style.display = 'block';
        },
        onTitleChange: function(i,callback){
            var t = this;  
            $(t.titleSlide).eq(i).addClass(t.defaults.titleActiveClass);
            callback.call(t,i);       
        },
        onSlideChange: function(i,callback){
            var t = this;
            t.onSlideChangeStart.call(t,i,t.defaults.onSlideChangeStart);
            $(t.contentSlide).eq(i).addClass(t.defaults.slideActiveClass);
            t.contentSlide[i].style.display = 'block';
            t.onSlideChangeEnd.call(t,i,t.defaults.onSlideChangeEnd);
            callback.call(t,i);
        },
        onSlideChangeStart: function(i,callback){
            callback.call(this,i);
        },
        onSlideChangeEnd: function(i,callback){
            callback.call(this,i);
        },
    }
    $.tab = function(container,params){
        var t = new Tab(container,params);
        return t;
    }
})(mgui)