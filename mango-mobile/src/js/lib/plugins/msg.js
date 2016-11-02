(function($){
    /**
     * [Msg description]
     * 弹窗
     * type,'' 'tip','alert','cofirm' 
     * title:'',       //标题文字
     * text :'',       //内容文字
     * btnSure : '确定',   //按钮文字
     * btnCancel : '取消',   //按钮文字
     * auto_close:false,   //自动消失
     * success //成功回调函数
     * failed //失败回调函数
     * callback
     */
    function Msg(options,callback) {
        this.seting = {
            type: 'alert',
            title: '',       
            text: '',       
            btnSure: '确定',   
            btnCancel: '取消',     
            autoClose: false,
            autoCloseTime: 2000, 
            success: function(){},
            failed: function(){}
        }
        
        this.callback = callback || function(){};

        $.extend(true,this.seting,options);

        this.init();

        return $;
    };
    Msg.prototype = {
        constructor: Msg,
        init: function(){
            var doc = document,
                bd =  doc.body;
                
            var id = 'mg-dialog' + new Date().getTime();
            var dialogExist = doc.querySelector('#' + id);

            if(dialogExist){
                return false;
            }

            var dialog = '<div class="mg-dialog" id="'+id+'">'
                            +'<div name="mg-dialog-msg" class="mg-dialog-msg"></div>'
                        +'</div>',
                        dialogMsgTitle = '<div class="mg-dialog-title"><strong class="mg-dialog-title-content">'+this.seting.title+'</strong></div>',
                        dialogMsgContent = '<div class="mg-dialog-msg-content">'+this.seting.text+'</div>';

            $.mask.show();

            bd.insertAdjacentHTML('beforeEnd', dialog);

            this.dialog = doc.querySelector('#' + id);
            this.dialogMsg = this.dialog.querySelectorAll('.mg-dialog-msg')[0];

            this.dialogMsg.insertAdjacentHTML('beforeEnd', dialogMsgTitle);
            this.dialogMsg.insertAdjacentHTML('beforeEnd', dialogMsgContent);

            switch(this.seting.type){
                case "tip":
                    //确认�
                    this.tip();
                    break;
                case "alert":
                    //警告�
                    this.alert();
                    break;
                case "confirm":
                    //确认�
                    this.confirm();
                    break;
                default:
                    //警告�
                    this.alert();
                    break;
            }
        },
        tip: function(){
            var dialogMsgBottom = '<div class="mg-dialog-bottom"></div>';
            this.dialogMsg.insertAdjacentHTML('beforeEnd', dialogMsgBottom);
            this.autoHide(true);
        },
        alert: function(){
            var dialogMsgBottom = '<div class="mg-dialog-bottom">'
                            +'<span href="javascript:;" class="mg-dialog-bottom-sure">'+this.seting.btnSure+'</span>'
                        +'</div>';
            this.dialogMsg.insertAdjacentHTML('beforeEnd', dialogMsgBottom);
            this.autoHide();
            this.handlerSuccess();
        },
        confirm: function(){
            var dialogMsgBottom = '<div class="mg-dialog-bottom">'
                            +'<span href="javascript:;" class="mg-dialog-bottom-cancel">'+this.seting.btnSure+'</span>'
                            +'<span href="javascript:;" class="mg-dialog-bottom-sure">'+this.seting.btnCancel+'</span>'
                        +'</div>';

            this.dialogMsg.insertAdjacentHTML('beforeEnd', dialogMsgBottom);
            this.autoHide();
            this.handlerSuccess();
            this.handlerFailed();
        },
        handlerSuccess: function(){
            this.dialogMsg.querySelector('.mg-dialog-bottom-sure').addEventListener('click',function(event){
                var event=event||window.event;
                if(event.stopPropagation){
                    event.stopPropagation();
                }else{
                    event.cancelBulle=true;
                }

                if(this.seting.success && Object.prototype.toString.call(this.seting.success) == "[object Function]"){
                    this.seting.success.call(this,this.dialog);
                    this.hide();
                }

            }.bind(this),false);
        },
        handlerFailed: function(){
            this.dialogMsg.querySelector('.mg-dialog-bottom-cancel').addEventListener('click',function(event){
                var event=event||window.event;
                if(event.stopPropagation){
                    event.stopPropagation();
                }else{
                    event.cancelBulle=true;
                }
                if(this.seting.failed && Object.prototype.toString.call(this.seting.failed) == "[object Function]"){
                    this.seting.failed.call(this,this.dialog);
                    this.hide();
                }
            }.bind(this),false);
        },
        hide: function(){
            this.dialog.parentNode.removeChild(this.dialog);
            $.mask.hide();
            this.callback.call(this);
        },
        autoHide: function(auto){
            if(typeof auto !== "undefined"){
                this.seting.autoClose = auto;
            }
            if(this.seting.autoClose){
                setTimeout(function(){
                    this.hide();
                }.bind(this),this.seting.autoCloseTime);
            }
        }
    }
    /**
     * [$.msg description]
     * 绑定�
     */
    $.msg = function(options,callback){
        var m = new Msg(options,callback);
        return m;
    }

})(mgui)