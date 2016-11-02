(function() {
    window.onload = function() {

        var memberId,    //会员id
            listUrl = "visa/getOrderList",  //列表接口地址
            checkPayUrl = 'visa/getSettlement',
            firstReq = [true,true,true], //第一次请求
            status = [2,1,3],    //三个请求的status
            scrollBtn = [true,true,true], //防止重复下拉
            noList = [false,false,false], //list为0
            showRes = [true,true,true], //是否请求更多订单
            swiperCount = 0,    //判断是在哪个列表下
            pageSize = 10,  
            orderPageInfo = {"pageNumber": 1,"pageSize": 10},
            orderPage = [orderPageInfo,orderPageInfo,orderPageInfo];//用作分页  默认获取第一页，十条
            
        
        var domainUrl = 'http://mt.mangocity.com/views/visa/',    //域名
            backUrl = domainUrl+'view/visa_order_details.html',  //请求支付完成后跳转的url
            loginBackUrl = domainUrl+'view/visa_order.html',    //登录完返回的url
            locationUrl = encodeURI(window.location.href),
            payUrl = "http://pay.mangocity.cn/alipayService/alipay/payment?orderId='+list.orderList[i].orderId+'&backurl='+newBackUrl+'";

        var orderHeader = $('.header'),
            orderHtmlContent = $('.swiper-wrapper .swiper-slide'),
            orderTitle = $('.swiper-title'),
            noMoreOrderText = '<div class="visa-no-more-order">没有更多订单了哦</div>', //没有更多订单提示 未确定
            noOrderText = '<div class="visa-no-order">没有订单哦</div>',     //没有订单提示  未确定
            loadText = '<div class="swiper-slide-load"><span class="box-circle"></span></div>'; //load
        
        
        

        //判断登录
        
        if(!memberId){
           checkLogin(1,locationUrl);
        }
        memberId = getMbrInfo();

        //获取订单编号  用来测试
        //memberId  = "10089"; //getMbrInfo(); //window.setCookie("memberId",'10089',10);


        /**
         * loading 页面最初动画
         * 
         */
        setTimeout(function(){$('#loading').remove()},0);


        /*tab*/
        tabSwiper();

        

        /**
         * [tabSwiper description]
         * tab function
         */
        function tabSwiper(){
            var sh = $(window).scrollTop(),  //滚动高度
                dh = $(document).height(),  //文档高度
                wh = $(window).height();  //分辨率
            var th = orderTitle.height(),
                oh = orderHeader.height();

            orderHtmlContent.height(wh-th-oh);

            var tabTitle = $(".swiper-title");
            var swiper = new Swiper('.swiper-container', {
                speed: 500,
                scrollbarHide: true,
                onSlideChangeStart: function() {
                    tabTitle.find('.active').removeClass("active");
                    tabTitle.find('span').eq(swiper.activeIndex).addClass("active");
                    swiperCount = swiper.activeIndex;
                    getOrderList(swiperCount);
                }
            });
            tabTitle.on("touchstart",'span',function(){
                tabTitle.find('.active').removeClass("active");
                $(this).addClass("active");
                swiper.slideTo($(this).index());
                swiperCount = $(this).index();
                getOrderList(swiperCount);
            });

            /*获取订单列表*/
            getOrderList(0);

        }

        /**
         * [getOrderList description]
         * 获取订单列
         */
        function getOrderList(num){
            if(firstReq[num]){
                firstReq[num] = false;
                orderAjax(listUrl,{"memberId":memberId,"status":status[num]},function(data){
                    var _data = data.data;
                    if(parseInt(_data.totalCount) < orderPage[num].pageNumber * pageSize && parseInt(_data.totalCount) !== 0){
                        showRes[num] = false;
                    }else if(parseInt(_data.totalCount) === 0){
                        noList[num] = true;
                    }
                    orderHtmlContent.eq(num).find('.swiper-slide-content').append(rendering(_data));
                }); 
            }
            
        }
        


        /**
         * [description]
         * 
         * 下拉刷新 ，更新订单
         */
        

        orderHtmlContent.scroll(function(){
            var sh = $(this).scrollTop(),
                wh = $(this).height();
                ch = $(this).find('.swiper-slide-content').height();

            if( (ch - sh) <= (wh -20) ){
                switch(swiperCount){
                    case 0:
                        getMoreOrderList({"memberId":memberId,"status":status[swiperCount],"page":orderPage[swiperCount],"num":swiperCount});
                        break;
                    case 1:
                        getMoreOrderList({"memberId":memberId,"status":status[swiperCount],"page":orderPage[swiperCount],"num":swiperCount});
                        break;
                    case 2:
                        getMoreOrderList({"memberId":memberId,"status":status[swiperCount],"page":orderPage[swiperCount],"num":swiperCount});
                        break;
                }
            }
        });  

        //待支付订单
        orderHtmlContent.on('click','.payele',function(){
            var id = $(this).attr('data-orderid'),
                money = $(this).attr('data-money');

            orderAjax(checkPayUrl,{orderId:id,realPayMoney:money},function(data){
                var _data = data.data;
                if(_data.flag){
                    window.location.href = 'http://pay.mangocity.cn/alipayService/alipay/payment?orderId='+id+'&backurl='+encodeURI(backUrl+'?orderDetailsId='+id);
                }else{
                    msg({
                        type: 'alert',
                        text: '信息有误'
                    });
                }
            });    

        });


        /**
         * [getOrderList description]
         * @param  {[type]}   obj 对象
         * @param  {Function} fn  回调函数
         * @return {[type]}    none
         * 请求订单列表
         */
        function orderAjax(url,obj,fn){
                //obj.page = {};
                //obj.memberId = obj.memberId || ""; //会员id
                //obj.status = obj.status || ""; //订单状态 已完成15,未完成 200，已取消 5
                //obj.page = obj.page || {"pageNumber":1,"pageSize":10};//pageNumber暂定为1 pageSize当期页码 //暂定为10 每页大小;           
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
         * [getMoreOrderList description]
         * @param  {[type]} obj  对象
         * @return {[type]} none
         * 获取更多订单列表
         */
        function getMoreOrderList(obj){
            var memberId = obj.memberId,
                status = obj.status,
                page = obj.page,
                num = obj.num;

            if(scrollBtn[num]){ //防止重复下拉
                scrollBtn[num] = false;

                if(noList[num]){    //list为0 的情况
                    return false;
                }

                orderHtmlContent.eq(num).find('.swiper-slide-content').append(loadText);

                //存在下一页的情况
                page.pageNumber ++;
                orderAjax(listUrl,{"memberId":memberId,"status":status,"page":page},function(data){
                    var _data = data.data;
                    if(parseInt(_data.totalCount) < (page.pageNumber-1) * pageSize){
                        showRes[num] = false;
                        scrollBtn[num] = false;
                        orderHtmlContent.eq(num).find('.swiper-slide-load').remove();
                        orderHtmlContent.eq(num).find('.swiper-slide-content').append(noMoreOrderText);
                        return false;
                    }
                    setTimeout(function(){
                        orderHtmlContent.eq(num).find('.swiper-slide-load').remove();
                        orderHtmlContent.eq(num).find('.swiper-slide-content').append(rendering(_data));
                    },30);
                    scrollBtn[num] = true;
                });
            }
        }


        /**
         * [rendering description]
         * @param  {[type]} list ajax数据
         * @param  {[type]} text 当没有数据时返回的内容
         * @return {[type]}  text 或者 html
         * 解析请求过来的数据
         */
        function rendering(list,text){
            var html = "",text= text || noOrderText;
            if(list.orderList.length === 0){
                html = text;
                return html;
            }else{
                for(var i = 0; i < list.orderList.length; i++){

                    if(list.orderList[i].status === "待支付"){
                        html += '<div class="visa-order-content">'
                                    +'<a class="payele" href="javascript:;" data-orderid="'+list.orderList[i].orderId+'" data-money="'+list.orderList[i].payPrice+'">'
                                       +' <div class="visa-order-content-title cfx">'
                                            +'<div class="visa-order-content-pic">'
                                                +'<img src="../img/default.png" data-src="'+list.orderList[i].imagePath+'" onload="imgOnLoad(this)"  alt="#" />'
                                           +' </div>'
                                            +'<div class="visa-order-content-info fl">'
                                                +'<div class="visa-order-content-info-title">'+list.orderList[i].productName+'</div>'
                                                +'<div class="visa-order-content-info-bottom">￥<span>'+list.orderList[i].orderPrice+'</span></div>'
                                            +'</div>'
                                        +'</div>'
                                        +'<div class="visa-order-content-bottom">'
                                            +'<span class="icon icon-time">&#xe60e;</span>'
                                            +'<span class="state">'+list.orderList[i].status+'</span>'
                                        +'</div>'
                                    +'</a>'
                                +'</div>';
                    }else{
                        html += '<div class="visa-order-content">'
                                    +'<a href="'+encodeURI(backUrl+'?orderDetailsId='+list.orderList[i].orderId)+'">'
                                       +' <div class="visa-order-content-title cfx">'
                                            +'<div class="visa-order-content-pic">'
                                                +'<img src="../img/default.png" data-src="'+list.orderList[i].imagePath+'" onload="imgOnLoad(this)"  alt="#" />'
                                           +' </div>'
                                            +'<div class="visa-order-content-info fl">'
                                                +'<div class="visa-order-content-info-title">'+list.orderList[i].productName+'</div>'
                                                +'<div class="visa-order-content-info-bottom">￥<span>'+list.orderList[i].orderPrice+'</span></div>'
                                            +'</div>'
                                        +'</div>'
                                        +'<div class="visa-order-content-bottom">'
                                            +'<span class="icon icon-time">&#xe60e;</span>'
                                            +'<span class="state">'+list.orderList[i].status+'</span>'
                                        +'</div>'
                                    +'</a>'
                                +'</div>';
                    }
                }
                return html;
            }
        }
    }

})()
