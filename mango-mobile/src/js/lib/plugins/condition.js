(function($){
    function Condition(container,params){
        if (!(this instanceof Condition)) return new Condition(container, params);
        
        this.defaults = {
            maskClass: 'mg-condition-mask',
            slideWrapClass: 'mg-condition-slide-wrap',
            slideClass: 'mg-condition-slide',
            slideActiveClass: 'mg-condition-slide-active',
            onSlideClick: function(){},
            onMaskClick: function(){}
        };

        $.extend(true,this.defaults,params);


        var c = this;
        c.container = $(container)[0];
        c.slideWrap = c.container.querySelectorAll('.' + c.defaults.slideWrapClass)[0];
        c.slide = c.container.querySelectorAll('.' + c.defaults.slideClass);
        c.mask = c.container.querySelectorAll('.' + c.defaults.maskClass)[0];
        c.show();
    }

    Condition.prototype.show = function(){
        var c = this;
        $(c.container).removeClass('mg-hide');

        var l = c.slide.length;

        c.slideWrap.onclick=function(event){
            var event = event || window.event;
            var target = event.target || event.srcElement;
            if(target.nodeName.toLowerCase() === 'li'){
                for(var j= 0; j < l; j++){
                    $(c.slide).eq(j).removeClass(c.defaults.slideActiveClass);
                }
                c.onSlideClick(target,c.defaults.onSlideClick);
            }
        }

        c.mask.onclick = function(){
            c.onMaskClick.call(c,c.defaults.onMaskClick);
        }
    }


    Condition.prototype.onMaskClick = function(callback){
        var c = this;  
        c.hide();
        callback.call(c);
    }


    Condition.prototype.onSlideClick = function(target,callback){
        var c = this;  
        $(target).addClass(c.defaults.slideActiveClass);
        callback.call(c,target);
        c.hide();
    }

    Condition.prototype.hide = function(){
        var c = this;
        $(c.container).addClass('mg-hide');
    }

    $.condition = function(container,params){
        var c = new Condition(container,params);
        return c;
    }
})(mgui);