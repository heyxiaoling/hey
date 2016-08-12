window.onload = function(){
    var doc = document,
        load = doc.querySelector('#loading'),
        textInput = doc.querySelector('#textInput'),
        spanSub = doc.querySelector('#spanSub'),
        mask = doc.querySelector('#mask'),
        popup = doc.querySelector('#popup'),
        popupClose = doc.querySelector('#card-close');
    var txt;

    //loading
    load.style.display = 'none';

    textInput.addEventListener('keyup',function(e){
        txt = this.value;
    },false);

    spanSub.addEventListener('click',function(){
        var re = /^1\d{10}$/;
        if (re.test(txt)) {
            ajax('get','index.php',txt,function(data){
                console.log(data);
                mask.style.display = 'block';
                popup.style.display = 'block';
            });
        } else {
            alert("请输入正确的手机号码");
            textInput.focus();
        }

    },false);

    popupClose.addEventListener('click',function(){

    },false);
   
} 

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

