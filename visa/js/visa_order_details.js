(function(){
    window.onload = function(){
        
        var orderId = GetQueryString('orderDetailsId'), //截取url,获取 orderId
            orderDetailsUrl = "visa/getOrderDetail", //订单详情接口地址
            cancelOrderUrl = "visa/cancelOrder"; //取消订单接口地址

        var domainUrl = 'http://mt.mangocity.com/views/visa/',    //域名
            backUrl = 'visa_order.html';  //取消订单成功url
            cancelUrl = 'visa_cancel_order.html',  //取消订单成功跳转的url
            addApplicantsUrl = 'visa_add_applicants.html?orderId='+orderId, //增加申请人url
            visaUploadUrl = 'visa_upload.html', //上传材料url
            mangoTel = 4006640066;

        var backBtn = $('#back'),
            order = $("#order-info"),   //信息
            orderContent = $(".order-info-content"),    //信息内容
            addApplicants = $(".order-add-applicants"), //添加申请人
            tps = $('#tps'), //取消订单和客户电话
            tpsBtn = $('.threecircle'), //取消订单按钮
            tpsDialog = $('.tps-dialog'), //取消订单和客户电话弹框
            visaState = $('.visa-state'); //订单状态
       
        /**
         * loading 页面最初动画
         * 
         */
        setTimeout(function(){$('#loading').remove()},0);

        //订单详情渲染
        orderAjax(orderDetailsUrl,{"orderId": orderId},function(data){
            renderTpsDialog(data);
            getProductName(data);
            getProductContent(data);
            getApplicants(data);
            getAddApplicants(data);
            renderVisaState(data);
        });

        
        //下拉显示跟多信息
        order.on('touchstart','.more-order-info',function(){
            orderContent.toggleClass('show');
            $(this).toggleClass('triangleToggle');
        });

        //隐藏显示退款和客户弹窗
        tps.on('touchstart',function(event){
            var event = event || window.event,target = event.target || event.srcElement;
            if(event.stopPropagation){
                event.stopPropagation(); //停止事件在DOM的传播
            }else{
                event.cancelBubble=true;
            }

            if(target.className === 'threecircle'){
                tpsDialog.toggleClass('show');
            }
        });

        //隐藏退款和客户弹窗
        $(document).on('touchstart',function(){
            if(tpsDialog.hasClass('show')){
                tpsDialog.removeClass('show');
            }
        });

        //返回上一页
        backBtn.on('touchstart',function(){
            window.location.href=backUrl;
        });

        //取消订单
        tps.on('touchstart','.tps-cancel-order',function(){
            msg({
                type:"confirm",
                text: "确定要取消订单吗？",
                success: function(){
                    orderCancel();
                },
                failed: function(){
                    tpsDialog.removeClass('show');
                }
            });
            
        });

        //客户电话
        tps.on('touchstart','.tps-mango-tel',function(){
            msg({
                type:"confirm",
                text: "确定要拨打芒果客户吗？",
                btnOkText: '<a href="tel:'+mangoTel+'">确定</a>',
                failed: function(){
                    tpsDialog.removeClass('show');
                }
            });
            
        });


        /**
         * [orderCancel description]
         * 取消订单
         */
        function orderCancel(){
            orderAjax(cancelOrderUrl,{"orderId": orderId},function(data){
                var _data = data.data;

                if(_data.flag){
                    window.location.href = cancelUrl;
                    return false; 
                }

                msg({
                   type:"autoClose",
                   text: "取消失败" 
                });
                
            });
        }

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
         * [renderTpsDialog description]
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         * 渲染取消订单弹窗
         */
        function renderTpsDialog(data){
            var _data = data.data,html = "",steteId = parseInt(_data.statusList[0].statusId);
            /*
                0待支付
                1已支付
                19待上传
                4审核中

             */
            if( steteId === 0 || steteId === 1 || steteId === 4 || steteId === 19){
                html = '<li><a href="javascript:;" class="tps-cancel-order"><i class="icon icon-tps-money">&#xe60d;</i>退款</a></li>'
                +'<li><a href="javascript:;" class="tps-mango-tel"><i class="icon icon-tps-custome">&#xe607;</i>芒果客服</a></li>';
            }else{
                html = '<li><a href="javascript:;" class="tps-mango-tel"><i class="icon icon-tps-custome">&#xe607;</i>芒果客服</a></li>';
            }
            
            tpsDialog.append(html);
        }


        /**
         * [getProductName description]
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         * 获取产品名并渲染
         */
        function getProductName(data){
            var _data = data.data,html = "";
            if(_data.productName){
                html = '<li class="list-ul-li">'
                            +'<a href="#" class="list-ul-li-a">'+_data.productName+'</a>'
                        +'</li>'
                order.find('ul').eq(0).append(html);
            }
        }


        /**
         * [getProductContent description]
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         * 获取产品名内容并渲染
         */
        function getProductContent(data){
            var _data = data.data;
            var orderCountry,orderInfoList;

            orderCountry = '<div class="order-info-country box-hori">'
                                +'<san class="order-country-img"><img  src="../img/default.png" data-src="'+_data.image+'" onload="imgOnLoad(this)" alt="#" /></san>'
                                +'<div class="order-country-info box-hori-1">'
                                    +'<dl>'
                                        +'<dd class="box-hori"><label>购买份数</label><em class="box-hori-1 text-ellipsis">'+_data.productNum+'份</em></dd>'
                                        +'<dd class="box-hori"><label>订单金额</label><em class="box-hori-1 text-ellipsis">￥'+_data.payPrice+'</em></dd>'
                                        +'<dd class="box-hori"><label>下单时间</label><em class="box-hori-1 text-ellipsis">'+_data.createDate+'</em></dd>'
                                        +'<dd class="box-hori"><label>订&nbsp;单&nbsp;号</label><em class="box-hori-1 text-ellipsis">'+_data.orderId+'</em></dd>'
                                    +'</dl>'
                                +'</div>'
                            +'</div>';
            orderInfoList = '<div class="order-info-tel">'
                                +'<ul class="list-ul list-br-c">'
                                    +'<li class="list-ul-li">'
                                        +'<a href="javascript:;" class="list-ul-li-a box-hori"><label>联系人</label><em class="box-hori-1  text-ellipsis">'+_data.name+'</em></a>'
                                    +'</li>'
                                    +'<li class="list-ul-li">'
                                        +'<a href="javascript:;" class="list-ul-li-a box-hori"><label>手机号</label><em class="box-hori-1  text-ellipsis">'+_data.mobile+'</em></a>'
                                    +'</li>'
                                    +'<li class="list-ul-li">'
                                        +'<a href="javascript:;" class="list-ul-li-a box-hori"><label>邮箱</label><em class="box-hori-1  text-ellipsis">'+_data.email+'</em></a>'
                                    +'</li>'
                                    +'<li class="list-ul-li">'
                                        +'<a href="javascript:;" class="list-ul-li-a box-hori"><label>地址</label><em class="box-hori-1  text-ellipsis">'+_data.address+'</em></a>'
                                    +'</li>'
                                +'</ul>'
                            +'</div>';

            orderContent.eq(0).append(orderCountry);
            orderContent.eq(0).append(orderInfoList);
        }


        /**
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         * 获取申请人信息
         */
        function getApplicants(data){
            var _data = data.data;
            var applicantsContent,applicantsContentList = ""; 
            var steteId = parseInt(_data.statusList[0].statusId);                 
            
            //申请人信息列表
            for(var i = 0; i < _data.passengerList.length; i++){
                if( steteId === 0 || steteId === 1 || steteId === 4 || steteId === 19){
                    var uploadUrl = visaUploadUrl + '?orderId=' + orderId + '&passengerId=' + _data.passengerList[i].passengerId ;
                        uploadUrl = encodeURI(uploadUrl);
                    applicantsContentList += '<li class="list-ul-li box-hori">'
                                                +'<p class="box-hori-3 text-ellipsis"><label>申请人</label><em>'+_data.passengerList[i].passengerName+'</em></p>'
                                                +'<p class="box-hori-3 m-r-10 text-ellipsis"><label>身份</label><em>'+_data.passengerList[i].visaIndentityTypeName+'</em></p>'
                                                +'<p class="box-hori-3 text-center text-ellipsis"><a href="'+uploadUrl+'">上传材料</a></p>'
                                            +'</li>';
                }else{
                    applicantsContentList += '<li class="list-ul-li box-hori">'
                                                +'<p class="box-hori-3 text-ellipsis"><label>申请人</label><em>'+_data.passengerList[i].passengerName+'</em></p>'
                                                +'<p class="box-hori-3 m-r-10 text-ellipsis"><label>身份</label><em>'+_data.passengerList[i].visaIndentityTypeName+'</em></p>'
                                                +'<p class="box-hori-3 text-center text-ellipsis"></p>'
                                            +'</li>';
                }
                
            }
            applicantsContent = '<div class="order-info-identity cfx">'
                                    +'<ul class="list-ul list-br-c">'+applicantsContentList+'</ul>'
                                +'</div>';

            $(applicantsContent).insertBefore(addApplicants);
            
        }


        /**
         * [getAddApplicants description]
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         * 添加申请人按钮
         */
        function getAddApplicants(data){
            var _data = data.data,applicantsBtn = "";

            //是否显示添加申请人按钮
            if(parseInt(_data.passengerList.length) < parseInt(_data.productNum)){
                applicantsBtn = '<a href="'+addApplicantsUrl+'">+&nbsp;&nbsp;添加申请人信息</a>';
                addApplicants.append(applicantsBtn);
                addApplicants.removeClass('hide');
                if(parseInt(_data.statusList[0].statusId) === 1){
                    msg({
                        type: 'alert',
                        text: '请添加申请人'
                    });                    
                }
                
            }
            
        }

        /**
         * [renderVisaState description]
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         * 渲染订单状态
         */
        function renderVisaState(data){
            var _data = data.data,stateList = "";
            
            for(var i = 0; i < _data.statusList.length; i++){
                stateList += '<li>'
                                +'<div class="visa-state-ball">'
                                    +'<em class="visa-state-circle"><i></i></em>'
                                    +'<dl>'
                                        +'<dt title="'+_data.statusList[i].statusComment+'">'+stateText(_data.statusList[i].statusId)+'</dt>'
                                        +'<dd>'+_data.statusList[i].createTime+'</dd>'
                                    +'</dl>'
                                +'</div>'
                            +'</li>';
                 
            }
            
            visaState.find('ul').append(stateList);
        }


        /**
         * [stateText description]
         * @param  {[type]} num [description]
         * @return {[type]}     [description]
         * 对应订单状态的文字说明
         */
        function stateText(num){
            /*
            var stateText = [
                        "0订单提交成功",
                        '1订单支付成功',
                        '2订单已取消'
                        '3订单已过期，请重新下单',
                        '4签证专员正在审核您的办签材料',
                        '8材料审核通过，请邮寄材料并等待出签',
                        '10出签失败',
                        '11出签成功',
                        '12签证回寄',
                        '14订单已完成',
                        '16退款处理中',
                        '17已成功退款',
                        '18退款失败',
                        '19请上传材料待签证专员审核',
 
            
                        待支付 0  *
                        已支付 1  *
                        已取消 2  
                        已过期 3  
                        审核中 4   *
                        待出签 8  
                        出签失败 10 
                        已出签 11
                        已寄单 12 
                        已完成 14 
                        待确认 15 
                        退款处理中 16 
                        退款成功17 
                        退款失败 18 
                        待上传19;  *

                    */
            var stateText = [
                "订单提交成功",
                '订单支付成功',
                '订单已取消',
                '订单已过期，请重新下单',
                '签证专员正在审核您的办签材料',
                '',
                '',
                '',
                '材料审核通过，请邮寄材料并等待出签',
                '',
                '出签失败',
                '出签成功',
                '签证回寄',
                '',
                '订单已完成',
                '',
                '退款处理中',
                '已成功退款',
                '退款失败',
                '请上传材料待签证专员审核'
            ];
            
            return stateText[parseInt(num)];
            
        }
    }
    
})()



    
