(function(){
var GetQueryString=	function (name){ 
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
    var r = window.location.search.substr(1).match(reg);  //获取url中"?"符后的字符串并正则匹配
    var context = ""; 
    if (r != null) 
         context = r[2]; 
    reg = null; 
    r = null; 
    return context == null || context == "" || context == "undefined" ? "" : context; 
};
var getDataFromAPI=function(obj){
    var abj = {},objObj,objStr;
    if(typeof obj.data === "string"){
        objObj = JSON.parse(obj.data);
        objStr = JSON.stringify(objObj);
    }
    objStr = JSON.stringify(obj.data);
    abj.url = 'http://apitest.mangocity.com:8001/apiserver/' + obj.url;
    abj.async = obj.async || true;
    abj.type = obj.type;
    abj.dataType = obj.dataType || "json";
    abj.data = objStr;
    abj.success = obj.success ;
    abj.error = obj.error;
    $.ajax(abj);
};
var Occupation_value=unescape(GetQueryString("Occupation"));
	var visa_Id = GetQueryString("visaId");
 (function init(){
    
 
 	getDataFromAPI({type:"post",data:{visaId:visa_Id},url:"visa/getVisaDetail",success:function(e){
 		if (e.code=="1") {
 			
			document.querySelector(".header_content").innerText=Occupation_value;
			for (var i=0;i<e.data.requiredInfo.length;i++) {
			
			 if (e.data.requiredInfo[i].typeDesc==Occupation_value) {
				for (var n=0;n<e.data.requiredInfo[i].detail.length;n++) {
					if (e.data.requiredInfo[i].detail[n].filePath!="") {
						$("#body_content").append("<section class='material_content'><h3 class='material_content_title'>"+e.data.requiredInfo[i].detail[n].title+"</h3><p class='material_content_font'>"+e.data.requiredInfo[i].detail[n].content+"</p><p class='material_content_font'><a href='"+e.data.requiredInfo[i].detail[n].filePath+"'>样本资料</a></p></section>")	
					}else{
					$("#body_content").append("<section class='material_content'><h3 class='material_content_title'>"+e.data.requiredInfo[i].detail[n].title+"</h3><p class='material_content_font'>"+e.data.requiredInfo[i].detail[n].content+"</p></section>")	
						
					}

				
				 }
			  }
		    }
			
 		} else{
 			alert("获取信息失败,请返回上页重新选择");
				window.history.go(-1)			
 		}
 		setTimeout(function(){$("#cover").remove()},0)   	
 	
 		   
 	}});
 })()

      
 window.onload=function(){

  $(".confirm").on("click",function(){

   	window.history.go(-1);
   }); 		    
    }
    
})()
       