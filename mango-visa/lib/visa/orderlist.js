import React,{Component} from 'react';
import * as ReactDOM from 'react-dom';
import {bindActionCreators } from 'redux';
import {connect} from 'react-redux';

import * as MGAction  from '../actions/index';
import {MgHeader,ImageBox,LoadingTip,AjaxTip} from '../common/component';
import {getDataFromAPI,Tips,checkLogin,getMbrInfo} from '../common/base';
import * as CM from '../common/component';

import {Link} from 'react-router';


require('../../css/swiper-3.3.1.min.css');


class ORDERLIST extends Component{
    constructor(props){
        super(props);
        document.title = this.props.route.name;
        this.state = {
            LOADINGTIP: true,
            AJAXFAILED: false,
            scrollBtn:true,
            jsonData: {"1":[],"2":[],"3":[]},
            firstReq: {"1":true,"2":true,"3":true},
            noList: {"1":false,"2":false,"3":false},  
            firstStatus: "2", 
            //memberId: "43464842",
            memberId: "",
            status: "2",
            orderPage: {"1":{"pageNumber": 1,"pageSize": 10},"2":{"pageNumber": 1,"pageSize": 10},"3":{"pageNumber": 1,"pageSize": 10}},
            swiper: null,
            totalCount: {"1":1,"2":1,"3":1},
            showLoadAnimation: {"1":false,"2":false,"3":false},
            noMoreOrder: {"1":false,"2":false,"3":false},
            noOrder: {"1":false,"2":false,"3":false},
        };
        
    }
    componentWillMount(){
        //验证登录
        //先注释
        // if(!this.state.memberId){
        //    checkLogin(1,encodeURI(window.location.href));
        // }

        // let memberId = getMbrInfo();

        // this.setState({memberId:memberId,LOADINGTIP:false});

        this.setState({memberId:"43464842",LOADINGTIP:false});

        let status = this.props.params.id;

        if(this.state.firstReq[status]){
            this.state.firstReq[status] = false;
            this.setState({firstStatus:status,status:status,AJAXFAILED:true},function(){
                this.ajaxAPI();
            })
        }
    }
    componentDidMount(){
        var _this = this;
        let orderHeader = $('.header'),
            orderHtmlContent = $('.swiper-wrapper .swiper-slide'),
            orderTitle = $('.swiper-title');

        let wh = $(window).height(),  
            th = orderTitle.height(),
            oh = orderHeader.height();

        orderHtmlContent.height(wh-th-oh);

        _this.state.swiper = new Swiper('.swiper-container', {
            speed: 500,
            scrollbarHide: true,
            onTransitionStart:function(){
                
            },
            onSlideChangeStart: function() {
                
            },
            onSlideChangeEnd:function(){
                let index = _this.state.swiper.activeIndex;
                _this.slideSwiper(index);
            }
        });
        
        orderHtmlContent.scroll(function(event){
            
            if(_this.state.noList[_this.state.status]){    
                return false;
            }

            let $this = $(this),
                contentsh = $this.scrollTop(),
                wraph = $this.height(),
                contenth = $this.find('.swiper-slide-content').height();
            if( (contenth - contentsh) <= (wraph -10) && _this.state.scrollBtn ){

                let page = _this.state.orderPage[_this.state.status];

                let showLoadAnimation = _this.state.showLoadAnimation;
                showLoadAnimation[_this.state.status] = true;

                _this.setState({ showLoadAnimation:showLoadAnimation,scrollBtn: false});
                
                page.pageNumber++;
                if(parseInt(_this.state.totalCount[_this.state.status]) < (page.pageNumber-1) * page.pageSize ){
                    //没有下一页
                    let noMoreOrder = _this.state.noMoreOrder;
                    noMoreOrder[_this.state.status] = true;

                    _this.setState({showLoadAnimation:{"1":false,"2":false,"3":false},noMoreOrder:noMoreOrder,scrollBtn: true});
                    return false;
                }
                setTimeout(function(){
                    _this.ajaxAPI();
                },200);
            }
        });
    }
    slideSwiper(status){
        var newStatus;
        if(parseInt(status) === 0){
            newStatus = "2";
        }else if(parseInt(status) ===1){
            newStatus = "1";
        }else if(parseInt(status) === 2){
            newStatus = "3";
        }

        if(this.state.firstReq[newStatus]){
            this.state.firstReq[newStatus] = false;
            this.setState({status:newStatus,AJAXFAILED:true},function(){
                this.ajaxAPI();
            });
            
        }else{
            this.setState({status:newStatus});
        }
    }
    headleSwiper(status){
        if(status === "2"){
            this.state.swiper.slideTo(0);
        }else if(status ==="1"){
            this.state.swiper.slideTo(1);
        }else if(status === "3"){
            this.state.swiper.slideTo(2);
        }
    }
    ajaxAPI(){
        let params,paramsObj = {};
        paramsObj.memberId = this.state.memberId;//客户id
        paramsObj.status = this.state.status;   //请求状态
        paramsObj.page = this.state.orderPage[this.state.status]; //请求页数

        params = JSON.stringify(paramsObj); 

        getDataFromAPI({
            type:'POST',
            url:'visa/getOrderList',
            data:params,
            success:(data)=>{
                if(data.code === "1"){

                    console.log(data);

                    let orderList = data.data.orderList;
                    let newJsonData = this.state.jsonData;

                    for(let i = 0; i< orderList.length; i++){
                        newJsonData[this.state.status].push(orderList[i]);
                    }

                    let noOrder = this.state.noOrder;
                    let totalCount = this.state.totalCount;

                    totalCount[this.state.status] = data.data.totalCount;
                    
                    
                    if(parseInt(data.data.totalCount) === 0){
                        noOrder[this.state.status] = true;
                    }

                    console.log(this.state.jsonData);

                    this.setState({
                        totalCount: totalCount,
                        jsonData: newJsonData,
                        noOrder: noOrder,
                        scrollBtn: true,
                        AJAXFAILED: false
                    });

                }else{
                    Tips({message:data.message});
                }
            },
            error:(data)=>{
                this.setState({
                    AJAXFAILED:true,
                    scrollBtn: true
                })
            }
        });
    }
    render (){
        /**
         * data 请求数据
         * des 根据请求数据组合产品信息字段
         */
        let data;
        data = this.state.jsonData;
        // 状态
        const swiperTitleState = [
            {
                "text": "进行中",
                "param": "2"
            },
            {
                "text": "已完成",
                "param": "1"
            },
            {
                "text": "已取消",
                "param": "3"
            }
        ]
        return (
            <div className="mg-fadeInRight">
                {
                    this.state.LOADINGTIP ? (
                        <LoadingTip />
                    ) : (

                        <div className="wrap">

                            <MgHeader data={{
                                gotoBack:true,
                                headerTitle: '订单列表',
                            }}  />
                            
                            <div className="content">
                                <section className="swiper-box">
                                    <div className="swiper-title box-hori tab-fixed">
                                        {
                                            swiperTitleState.map((item,index)=>{
                                                return <span key={index} className={ (this.state.status === item.param) ? 'box-hori-1 active' : 'box-hori-1'} onClick={this.headleSwiper.bind(this,item.param)}>{item.text}</span>
                                            })  
                                        }
                                    </div>
                                    <div className="swiper-container">
                                        <div className="swiper-wrapper">
                                            <div className="swiper-slide order-slide">
                                                {
                                                    (this.state.AJAXFAILED || this.state.firstReq["2"]) ? <AjaxTip /> : <ORDERLISTCONTETN orderData = {data["2"]} showLoadAnimation={this.state.showLoadAnimation} noOrder={this.state.noOrder}  noMoreOrder={this.state.noMoreOrder} status={this.state.status} />
                                                }
                                            </div>
                                            <div className="swiper-slide order-slide">
                                                {
                                                    (this.state.AJAXFAILED || this.state.firstReq["1"]) ? <AjaxTip /> : <ORDERLISTCONTETN orderData = {data["1"]} showLoadAnimation={this.state.showLoadAnimation} noOrder={this.state.noOrder}  noMoreOrder={this.state.noMoreOrder} status={this.state.status} />
                                                }
                                            </div>
                                            <div className="swiper-slide order-slide">
                                                {
                                                    (this.state.AJAXFAILED || this.state.firstReq["3"]) ? <AjaxTip /> : <ORDERLISTCONTETN orderData = {data["3"]} showLoadAnimation={this.state.showLoadAnimation} noOrder={this.state.noOrder}  noMoreOrder={this.state.noMoreOrder} status={this.state.status} />
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    )
                }
                
            </div> 
        )
    }
}

class ORDERLISTCONTETN extends Component{
    constructor(props){
        super(props)
        this.state = {

        }
    }
    checkPayAjaxAPI(id,money){
        let params,paramsObj = {};
        paramsObj.orderId = id;//订单编号
        paramsObj.realPayMoney = money;   //实付金额

        params = JSON.stringify(paramsObj); 

        getDataFromAPI({
            type:'POST',
            url:'visa/getSettlement',
            data:params,
            success:(data)=>{
                if(data.code === "1"){
                    window.location.href = 'http://pay.mangocity.cn/alipayService/alipay/payment?orderId='+id+'&backurl='+encodeURI('http://10.10.152.54:8888/#/visa/details/'+id);
                }else{
                    Tips({message:data.message});
                }
            },
            error:(data)=>{
               Tips({message:data});
            }
        });
        
    }
    render(){
        return (
            <div className="swiper-slide-content">
                {
                    (this.props.orderData && (this.props.orderData.length < 1)) ? 
                    (
                        <div className="visa-no-order">
                            <CM.NoContent title="没有订单哦" content="暂时没有此类数据" />
                        </div>
                    ) : 
                    (
                        <div>
                            {
                                this.props.orderData.map( (item, index) => {
                                    if(item.status === "待支付"){
                                        return  <div className="visa-order-content" key={index}>
                                                    <a className="payele" href="javascript:;" onClick={this.checkPayAjaxAPI.bind(this,item.orderId,item.payPrice)}>
                                                        <div className="visa-order-content-title cfx">
                                                            <div className="visa-order-content-pic">
                                                                <ImageBox imageUrl={item.imagePath} />
                                                            </div>
                                                            <div className="visa-order-content-info fl">
                                                                <div className="visa-order-content-info-title">{item.productName}</div>
                                                                <div className="visa-order-content-info-bottom">￥<span>{item.orderPrice}</span></div>
                                                            </div>
                                                        </div>
                                                        <div className="visa-order-content-bottom">
                                                            <span className="icon icon-time">&#xe60e;</span>
                                                            <span className="state">{item.status}</span>
                                                        </div>
                                                    </a>
                                                </div>
                                    }else{
                                        return  <div className="visa-order-content" key={index}>
                                                    <Link to={'visa/details/'+item.orderId}>
                                                        <div className="visa-order-content-title cfx">
                                                            <div className="visa-order-content-pic">
                                                                <ImageBox imageUrl={item.imagePath} />
                                                            </div>
                                                            <div className="visa-order-content-info fl">
                                                                <div className="visa-order-content-info-title">{item.productName}</div>
                                                                <div className="visa-order-content-info-bottom">￥<span>{item.orderPrice}</span></div>
                                                            </div>
                                                        </div>
                                                        <div className="visa-order-content-bottom">
                                                            <span className="icon icon-time">&#xe60e;</span>
                                                            <span className="state">{item.status}</span>
                                                        </div>
                                                    </Link>
                                                </div>
                                    }
                                })
                            }
                            {
                                this.props.showLoadAnimation[this.props.status] ? <div className="swiper-slide-load"><span className="box-circle"></span></div> : ''
                            }
                            {
                                this.props.noOrder[this.props.status] ? <div className="visa-no-order">没有订单哦</div> : ''
                            }
                            {
                                this.props.noMoreOrder[this.props.status] ? <div className="visa-no-more-order">没有更多订单了哦</div> : ''
                            }
                        </div>
                    )
                }                                       
            </div>
        )
    }
}




function mapStateToProps(state){
    return {
        LOADINGTIP:state.RDcount.get('LOADINGTIP'),
        LOGINSTATE:state.RDcount.get('LOGINSTATE'),
    };
};
function mapDispatchToProps(dispatch){
    return {
        ACTIONS:bindActionCreators(MGAction,dispatch)
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(ORDERLIST);
