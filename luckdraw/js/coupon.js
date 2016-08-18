import loader from './load';
import ajax from './ajax';
import msg from './msg';

let doc = document,
        no_draw = doc.querySelector('.no-draw'),
        coupon_ul = doc.querySelector('.coupon-ul'),
        coupon_li;

let btn = true;

let getCard = () => {
    let ul_html = '';
    ajax('get','http://mt.mangocity.com/act/index.php','c=weichat_oauth2&m=get_all_prize',function(data){
        data = JSON.parse(data);
        let message = data.message;
        if(data.code === "1"){
            if(message.length > 0){
                for(let i= 0; i < message.length; i++){
                    ul_html +=  '<li>'
                                    +'<div class="card coupon-card">'
                                        +'<div class="card-price">'
                                            +'<strong><i>￥</i><item>'+message[i].prize+'</item></strong>'
                                            +'<span>环球旅游卡<br/>优惠券</span>'
                                            +'<em title='+message[i].id+'>注销</em>'
                                        +'</div>'
                                        +'<div class="card-time">展会期间有效（请联系现场人员兑换）</div>'
                                    +'</div>'
                                +'</li>';
                }
                coupon_ul.innerHTML = ul_html;
                coupon_li = coupon_ul.querySelectorAll('li');

                //删除卡卷
                removeCard(); 
            }else{
                no_draw.style.display = 'block';
            }
           
           
            
        }else{
            alert(data.message);
        }
    });
}
    
let removeCard = () => {

    for(let i = 0; i<coupon_li.length; i++){
        coupon_li[i].addEventListener('click',function(event){
            let target = event.target || event.srcElement,
                li_lenght = coupon_ul.querySelectorAll('li').length,
                title = target.title;
            if(target.nodeName.toLowerCase() == 'em' && btn){
                btn = false;
                msg({
                    type:'confirm',
                    text:"确定要删除优惠券吗？",
                    success:function(){
                        ajax('get','http://mt.mangocity.com/act/index.php','c=weichat_oauth2&m=check_prize&id=' + title,function(data){
                            btn = true;
                            data = JSON.parse(data);
                            if(data.code === "1"){
                               coupon_li[i].parentNode.removeChild(coupon_li[i]);
                               if((li_lenght-1) <= 0){
                                    no_draw.style.display = 'block';
                               }
                            }else{
                                msg({
                                    type: 'alert',
                                    text: data.message
                                });
                            }
                        });
                    },
                    failed:function(){
                        btn = true;
                    }
                })
            }
        },false);
    }
}

window.onload = function(){
    //loading..
    loader();
    //获取卡卷列表
    getCard();
}