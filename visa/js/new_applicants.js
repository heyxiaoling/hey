(function(){
    window.onload = function(){

        var orderId = GetQueryString('orderId'), //截取url,获取 orderId
            passengerId = GetQueryString('passengerId') || '', //获取passengerId
            passengerName = decodeURI(GetQueryString('passengerName')) || '',//获取name
            productCode = GetQueryString('productCode'),    //获取产品编号
            passengerIndentity = decodeURI(GetQueryString('passengerIndentity')) || '',//获取身份
            addPassengerUrl = "visa/addOrUpdatePassenger",   //新增或修改出行人信息接口地址
            indentityTypesUrl = "visa/getIndentityTypes";   //身份类型列表接口地址
            
        var domainUrl = 'http://mt.mangocity.com/views/visa/',    //域名
            backUrl = 'visa_add_applicants.html?orderId='+ orderId;  //增加申请人成功后跳转的url

        var backBtn = $('#back'),
            passenger = $('.new-applicants'),
            passengerInput = passenger.find('.name'),
            indentityType = passenger.find('.visaindentitytype'),
            identity = passenger.find('.identity'),
            identityList = $('.identity-list'),
            identityListMask = identityList.find('.mask'),
            identityListUl = identityList.find('ul'),
            visaIndentityType = "1";

        /**
         * loading 页面最初动画
         * 
         */
        setTimeout(function(){$('#loading').remove()},0);
        
        //初始化名字，身份
        initializeData();
         
        //初始化身份列表
        orderAjax(indentityTypesUrl,{productCode:productCode},function(data){
            renderIdentityList(data);
        })

        backBtn.on('touchstart',function(){
            var obj = {};
            obj.orderId = orderId;
            obj.passengerId = passengerId;
            obj.passengerName = passengerInput.val() || '';
            obj.visaIndentityType = visaIndentityType;
            
            orderAjax(addPassengerUrl,obj,function(data){
                window.location.href = backUrl;
            });
        });


        // 显示隐藏 identity
        identity.on('touchstart',function(){
            identityList.toggleClass('show');
        });


        //点击背景隐藏
        identityListMask.on('touchstart',function(){
            identityList.toggleClass('show');
        });


        //选择身份
        identityListUl.on('click','li a',function(){
            var _this = $(this),_html = _this.html();
            visaIndentityType = _this.attr('data-indentityid');

            identityListUl.find('li a').removeClass('active');
            _this.addClass('active');

            indentityType.html(_html);

            identityList.toggleClass('show');
        });

        
        function initializeData(){
            if(passengerName !== "null" && passengerIndentity !== "null"){
                passengerInput.attr('value',passengerName);
                indentityType.html(passengerIndentity);
            }

        }

        function renderIdentityList(data){
            var _data=data.data,html = "";
            for(var i = 0; i< _data.length; i++){
                html += '<li class="list-ul-li">'
                            +'<a href="javascript:;" class="list-ul-li-a box-hori" data-indentityId="'+_data[i].indentityId+'">'+_data[i].indentityType+'</a>'
                        +'</li>'
            }
            identityListUl.append(html);
        }


        /**
         * [orderAjax description]
         * @param  {[type]}   url [description]
         * @param  {[type]}   obj [description]
         * @param  {Function} fn  [description]
         * @return {[type]}       [description]
         */
        function orderAjax(url,obj,fn){
            getDataFromAPI({
                type: "POST",
                url: url,
                data: obj,
                dataType: "json",
                success: function(data){
                    if(data.code === "1"){
                        fn.call(this,data);
                    }else{
                        msg({
                            type:'alert',
                            text:data.message,
                        });
                    }
                }
            });
        }
    }
})()