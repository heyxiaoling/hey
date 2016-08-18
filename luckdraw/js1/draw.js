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
        textInput = doc.querySelector('#textInput'),
        spanSub = doc.querySelector('#spanSub'),
        mask = doc.querySelector('#mask'),
        popup = doc.querySelector('#popup'),
        popupClose = doc.querySelector('#card-close'),
        prize =  doc.querySelector('.prizetype'),
        time = doc.querySelector('.card-time');
        
    var txt,btn = true;

    //loading..
    load.style.display = 'none';

    textInput.addEventListener('keyup',function(e){
        txt = this.value;
    },false);

    spanSub.addEventListener('click',function(){
        var re = /^1\d{10}$/;
        if (re.test(txt) && btn) {
            btn = false;
            ajax('get','http://mt.mangocity.com/act/index.php','c=weichat_oauth2&m=win_prize&phone=' + txt,function(data){
                btn = true;
                data = JSON.parse(data);
                if(data.code === "1"){
                    data.prizetype ? (prize.innerHTML = data.prizetype) : prize.innerHTML = '';
                    data.time ? (time.innerHTML = '有效期：' + data.time) : time.innerHTML='';
                    cardToggle(true);
                }else{
                    alert(data.message);
                }
                
            });
        }else if(re.test(txt) && !btn){
            alert("操作频繁");
        }else{
            alert("请输入正确的手机号码");
            textInput.focus();
        }

    },false);

    popupClose.addEventListener('click',function(){
        cardToggle(false);
    },false);

    function cardToggle(bool) {
        if(bool){
            mask.style.display = 'block';
            popup.style.display = 'block';

        }else{
            mask.style.display = 'none';
            popup.style.display = 'none';

        }
    } 
}




