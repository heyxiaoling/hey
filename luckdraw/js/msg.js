class Msg {
    constructor(options) {
        Object.assign(this, {
            type:'confirm',
            title:'',       //标题文字
            text :'',       //内容文字
            btnOkText : '确定',   //按钮文字
            btnNoText : '取消',   //按钮文字
            maskbtn : true,     //是否显示遮罩
            auto_close:false,   //自动消失
            success:function(){},
            failed:function(){}
        },options);

        this.init();
    }
}

Msg.prototype.init=function(){
    let doc = document,
        bd =  doc.body,
        dialogExist = doc.querySelector('#dialog');

    let dialog = '<div class="dialog" id="dialog">'
                    +'<div class="dialog-mask" id="dialog-mask" name="dialog-mask"></div>'
                    +'<div name="dialog-msg" class="dialog-msg" id="dialog-msg"></div>'
                +'</div>',
                dialogMsgTitle = '<div class="dialog-title"><strong class="dialog-title-content">'+this.title+'</strong></div>',
                dialogMsgContent = '<div class="dialog-msg-content">'+this.text+'</div>';


    if(dialogExist){
        return false;
    }

    bd.insertAdjacentHTML('beforeEnd', dialog);

    this.dialog = doc.querySelector('#dialog');
    this.dialogMsg = this.dialog.querySelector('#dialog-msg');

    this.dialogMsg.insertAdjacentHTML('beforeEnd', dialogMsgTitle);
    this.dialogMsg.insertAdjacentHTML('beforeEnd', dialogMsgContent);

    switch(this.type){
        case "confirm":
            //确认框
            this.confirm();
            break;
        case "alert":
            //警告框
            this.alert();
            break;
        default:
            //警告框
            this.alert();
            break;
    }
}

Msg.prototype.confirm=function(){
    let dialogMsgBottom = '<div class="dialog-bottom">'
                            +'<a href="javascript:;" class="dialog-bottom-cancel">'+this.btnNoText+'</a>'
                            +'<a href="javascript:;" class="dialog-bottom-sure">'+this.btnOkText+'</a>'
                        +'</div>';

    this.dialogMsg.insertAdjacentHTML('beforeEnd', dialogMsgBottom);
    this.handlerSuccess();
    this.handlerFailed();
}
Msg.prototype.alert=function(){
    let dialogMsgBottom = '<div class="dialog-bottom">'
                            +'<a href="javascript:;" class="dialog-bottom-sure">'+this.btnOkText+'</a>'
                        +'</div>';
    this.dialogMsg.insertAdjacentHTML('beforeEnd', dialogMsgBottom);
    this.handlerSuccess();
}


Msg.prototype.handlerSuccess=function(){
    var _this=this;
    _this.dialogMsg.querySelector('.dialog-bottom-sure').addEventListener('click',function(event){
        var event=event||window.event;

        if(event.stopPropagation){
            event.stopPropagation();
        }else{
            event.cancelBulle=true;
        }

        if(_this.success && Object.prototype.toString.call(_this.success)=== '[object Function]'){
            _this.success.call(this,_this,dialog);
        }

        setTimeout(function(){
            _this.hide();
        },300);

    },false);
}

Msg.prototype.handlerFailed=function(){
    var _this=this;
    _this.dialogMsg.querySelector('.dialog-bottom-cancel').addEventListener('click',function(event){
        var event=event||window.event;
        if(event.stopPropagation){
            event.stopPropagation();
        }else{
            event.cancelBulle=true;
        }
        if(_this.failed && Object.prototype.toString.call(_this.failed)=== '[object Function]'){
            _this.failed.call(this,_this.dialog);
        }
        setTimeout(function(){
            _this.hide();
        },300);
    },false);
}


Msg.prototype.hide=function(){
    var _this = this;
    _this.dialog.parentNode.removeChild(_this.dialog);
    _this.canmove();
}

Msg.prototype.nomove=function(){
    var _this=this;
    document.addEventListener('touchmove',function(event){
        _this.move(event);
    },false);
    document.body.style.overflow = "hidden";
}
Msg.prototype.move=function(evnet){
    var event=event||window.event;
    event.preventDefault();
    event.cancelBubble = true;
}

Msg.prototype.canmove=function(){
    var _this=this;
    document.removeEventListener('touchmove',function(event){
        _this.move(event);
    },false);
    document.body.style.overflow = "visible";
}

const msg = (options = {}) =>{
    let m = new Msg(options);
    return m;
}

export default msg;
