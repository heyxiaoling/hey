/**
 * Created by zhuyu on 2016/10/20.
 */
(function($) {
    $.fn.popup = function(inConfig) {
        if(this.length<=0) {
            return;
        }
        if(!inConfig && this[0].tagName.toLowerCase()=="select") {
            this.each(function(i,dom){
                //dom.setAttribute("disabled","disabled");
                dom.onbeforeactivate = function(){return false;};
                dom.onfocus = function(){this.blur();};
                dom.onmouseover = function(){!this.setCapture || this.setCapture();};
                dom.onmouseout = function(){!this.releaseCapture || this.releaseCapture();};
                var tmpDom = document.createElement("div");
                tmpDom.className = 'mg-popup';
                var tmpUlDom = document.createElement("ul");
                tmpUlDom.className = 'mg-table-view';
                tmpDom.appendChild(tmpUlDom);
                document.body.appendChild(tmpDom);
                for(var i=0;i<dom.children.length;i++) {
                    var item = document.createElement("li");
                    item.className = 'mg-table-view-cell mg-bg-white';
                    item.innerHTML += '<a value="'+dom.children[i].value+'" class="mg-txt-center">'+dom.children[i].text+'</a>'
                    tmpUlDom.appendChild(item);
                }
                tmpDom.innerHTML += '</ul>';
                var popDom = $(tmpDom).popup({
                    type:"bottom"
                });
                dom.addEventListener('click',function(e){
                    popDom.show();
                    return false;
                });
                $(tmpDom).on('click','a',function(e){
                    for(var i=0;i<dom.children.length;i++) {
                        if(dom.children[i].value == this.getAttribute('value')){
                            dom.children[i].selected = true;
                        } else {
                            dom.children[i].selected = false;
                        }
                    }
                    popDom.hide();
                    return false;
                });
            });
            return;
        }
        // 默认参数
        var config = {
            type:"",
            cancel:".mg-popup-cancel", // 传入选择器值
            duration:200,
            mask:true,
            autoHide:true
        };
        config = $.extend(config,inConfig);
        var self = this;
        var isOpen = false;
        // 对transform属性兼容处理
        var transformName = "transform";
        if(self[0].style.transform != "") {
            transformName = "webkitTransform";
        }000
        self[0].style.transition = "-webkit-transform "+config.duration+"ms ease-out";
        var showFunc = function(){};
        var hideFunc = function(){};
        // 定义弹出类型
        switch (config.type) {
            case "top":
                self[0].style.top = -window.innerHeight+'px';
                self[0].style.display = "block";
                self[0].style.top = -self[0].clientHeight+'px';
                showFunc = function(){
                    self[0].style[transformName] = 'translate(0px, '+self[0].clientHeight+'px) scale(1)';
                }
                hideFunc = function(){
                    self[0].style[transformName] = 'translate(0px, 0px) scale(1)';
                }
                break;
            case "bottom":
                self[0].style.top = window.innerHeight+'px'; // 避免显示
                self[0].style.display = "block";
                showFunc = function(){
                    self[0].style[transformName] = 'translate(0px, -'+self[0].clientHeight+'px) scale(1)';
                }
                hideFunc = function(){
                    self[0].style[transformName] = 'translate(0px, 0px) scale(1)';
                }
                break;
            default: // 默认中间弹出
                self[0].style.top = -window.innerHeight+'px'; // 避免显示
                self[0].style.display = "block";
                var tmpHeight = self[0].clientHeight;
                self[0].style.display = "none";
                self[0].style.top = window.innerHeight/2-(tmpHeight/2)+'px';
                showFunc = function(){
                    self[0].style.display = "block";
                    self[0].style.top = window.innerHeight/2-(self[0].clientHeight/2)+'px';
                }
                hideFunc = function(){
                    self[0].style.display = "none";
                    self._hide();
                }
                break;
        }

        this.show = function(){
            if(isOpen) {
                return;
            }
            config.mask && $.mask.show();
            showFunc();
            isOpen = true;
        };

        this.hide = function() {
            if(!isOpen) {
                return;
            }
            hideFunc();
            isOpen = false;
        }

        this._hide = function() {
            config.mask && $.mask.hide();
        }

        self[0].addEventListener('webkitTransitionEnd', function (e) {
            if(!isOpen) {
                self._hide();
            }
        }, false);

        // 关闭事件监听
        self.on('click', config.cancel, function(e) {
            self.hide();
        });

        config.autoHide && $.mask.onClick(function(e){

            self.hide();
        });
        return this;
    };
})(mgui);