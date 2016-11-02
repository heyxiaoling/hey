(function(){
    window.onload = function(){
        
        var orderId = GetQueryString('orderId'), //截取url,获取 orderId
            orderDetailsUrl = "visa/getOrderDetail"; //订单详情接口地址

        var domainUrl = 'http://mt.mangocity.com/views/visa/',    //域名
            backUrl = 'visa_order_details.html?orderDetailsId=' + orderId;  //增加申请人成功后跳转的url

        var backBtn = $('#back'),
            passenger = $('.add-applicants-list'),
            addApplicants = $('.add-applicants-info'),
            dataBtn = false,
            shenqingBtn = false;


        /**
         * loading 页面最初动画
         * 
         */
        setTimeout(function(){$('#loading').remove()},0);

        //渲染 申请人列表 和 申请人按钮
        orderAjax(orderDetailsUrl,{"orderId": orderId},function(data){
            getIndentity(data);
            getAddApplicants(data);
        });


        //新增 删除 出行人  暂定为所有选定
        passenger.on('touchstart','.applicants-list-checked',function(){
            var _this = $(this);
            //_this.toggleClass('checked');
            
        })

        //返回上一页
        backBtn.on('touchstart',function(){
            if(dataBtn){
                if(shenqingBtn){
                    window.location.href=backUrl;
                }else{
                    msg({
                        type:'alert',
                        text: '申请人数与购买份数不一致'
                    });
                }
            }
            
        });


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
                           type:"alert",
                           text:  data.message
                        });
                    }
                }
            });
        }


        /**
         * [getIndentity description]
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         * 获取申请人列表并渲染
         */
        function getIndentity(data){
            var _data = data.data,html = "",url = "",enUrl = "";

            //申请人列表
            for(var i = 0; i < _data.passengerList.length; i++){
                url = 'new_applicants.html?orderId='+orderId+'&passengerId='+_data.passengerList[i].passengerId+'&passengerName='+encodeURI(_data.passengerList[i].passengerName)+'&productCode='+encodeURI(_data.productCode)+'&passengerIndentity='+encodeURI(_data.passengerList[i].visaIndentityTypeName);
                enUrl = encodeURI(url);
                html += '<li class="list-ul-li">'
                            +'<div class="applicants-list box-hori">'
                                +'<div class="applicantsvisaIndentityType-list-checked checked" data-name="'+_data.passengerList[i].passengerName+'" data-id="'+orderId+'" data-passengerId="'+_data.passengerList[i].passengerId+'" data-visaIndentityType="'+_data.passengerList[i].visaIndentityType+'" >'
                                    +'<i class="icon icon-checked">&#xe603;</i>'
                                    +'<i class="icon icon-no-checked">&#xe604;</i>'
                                +'</div>'
                                +'<div class="applicants-list-info box-hori-1">'
                                    +'<label>'+_data.passengerList[i].passengerName+'</label><em>'+_data.passengerList[i].visaIndentityTypeName+'</em>'
                                +'</div>'
                                +'<div class="applicants-list-edit">'
                                    +'<a href="'+enUrl+'"><i class="icon icon-edit">&#xe605;</i></a>'
                                +'</div>'
                            +'</div>'
                        +'</li>';

            }

            passenger.append(html);
            
        }


        /**
         * [getAddApplicants description]
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         * 添加申请人显示问题
         */
        function getAddApplicants(data){
            var _data = data.data,applicantsBtn = "";

            
            //是否显示添加申请人按钮
            if(parseInt(_data.passengerList.length) < parseInt(_data.productNum)){
                var applicantsBtn = '<a href="new_applicants.html?orderId='+orderId+'&productCode='+encodeURI(_data.productCode)+'">+&nbsp;&nbsp;新增申请人</a>';
                addApplicants.append(applicantsBtn);
                shenqingBtn = false;
            }else{
                shenqingBtn = true;
            }

            dataBtn = true;
        }
    }
})()