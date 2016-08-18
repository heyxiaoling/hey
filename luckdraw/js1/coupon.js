function ajax(method,url,data,success){
    var xhr=null;
     
    try{
        xhr=new XMLHttpRequest();
    }catch(e){
        xhr=new ActiveXObject('Microsoft.XMLHTTP');
    }
     
    if(method=='get'&&data){
        url+='?'+data;
    }
 
    xhr.open(method,url,true);
     
    if(method=='get'){
        xhr.send();
    }else{
        xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
        xhr.send(data);
    }
 
    xhr.onreadystatechange=function(){
        if(xhr.readyState==4){
            if(xhr.status==200){
                success && success(xhr.responseText);
            }else{
                alert('出错了'+ xhr.status);
            }
        }
    }
}


window.onload = function(){
    var doc = document,
        load = doc.querySelector('#loading'),
        no_draw = doc.querySelector('.no-draw'),
        coupon_ul = doc.querySelector('.coupon-ul'),
        coupon_li;
    var btn = true;

    //loading..
    load.style.display = 'none';
    

    function getCard(){
        var ul_html = '';
        ajax('get','http://mt.mangocity.com/act/index.php','c=weichat_oauth2&m=get_all_prize',function(data){
            data = JSON.parse(data);
            var message = data.message;
            if(data.code === "1"){
                if(message.length >= 0){
                    for(var i= 0; i < message.length; i++){
                        ul_html += '<li>'
                                        +'<div class="card coupon-card">'
                                            +'<div class="card-price">'
                                                +'<strong><i>￥</i><item>'+message[i].prize+'</item></strong>'
                                                +'<span>环球旅游卡<br/>优惠券</span>'
                                                +'<em title='+message[i].id+'>注销</em>'
                                            +'</div>'
                                            +'<div class="card-time">有效期：'+message[i].time+'</div>'
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
        
    function removeCard(){
        for(var i = 0; i<coupon_li.length; i++){
            (function s(i){
                coupon_li[i].addEventListener('click',function(event){
                    var target = event.target || event.srcElement;
                    if(target.nodeName.toLowerCase() == 'em' && btn){
                        btn = false;
                        if(confirm("确定要删除优惠卷吗？")){
                            var title = target.title;
                            ajax('get','http://mt.mangocity.com/act/index.php','c=weichat_oauth2&m=check_prize&id=' + title,function(data){
                                btn = true;
                                data = JSON.parse(data);
                                var message = data.message;
                                if(data.code === "1"){
                                   coupon_li[i].parentNode.removeChild(coupon_li[i]);
                                }else{
                                    alert(data.message);
                                }
                            });
                        }else{
                            btn = true;
                        }
                    }
                },false);
            })(i);
            
        }
    }

    //获取卡卷列表
    getCard();

}