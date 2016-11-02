import React,{Component} from 'react';
import {bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import * as MGAction  from '../actions/index';

import {MgHeader,LoadingTip,AjaxTip,ImageBox,Msg} from '../common/component';
import {getDataFromAPI,Tips} from '../common/base';
import * as CM from '../common/component';

import {Link} from 'react-router';

const CONSTSTATETEXT = [
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

const TEL = "4006640066";

class DETAILS extends Component{
    constructor(props){
        super(props)
        document.title = this.props.route.name
        this.state = {
            LOADINGTIP: false,
            AJAXFAILED: false,
            orderId: '',
            jsonData: null,
            cancelBtn: false,
            telMsg: false,
            cancelOrderMsg: false
        };
    }
    componentWillMount(){
        this.setState({LOADINGTIP:false});

        let orderId = this.props.params.id;

        this.setState({orderId:orderId,AJAXFAILED:true},function(){
            this.ajaxAPI();
        })
    }
    handleCancelOrder(){
        this.setState({cancelOrderMsg:true});
    }
    handleTel(){
        this.setState({telMsg:true});
        // setTimeout(function(){
        //     this.setState({telMsg:false});
        // }.bind(this),3000);
    }
    handleTelSuccess(){
        this.setState({telMsg:false});
    }
    handleTelFailed(){
        this.setState({telMsg:false});
    }
    handleOrderSuccess(){
        this.cancelOrderAjax();
        this.setState({cancelOrderMsg:false});
    }
    handleOrderFailed(){
        this.setState({cancelOrderMsg:false});
    }
    ajaxAPI(){
        let params,paramsObj = {};
        paramsObj.orderId = this.state.orderId;//订单编号

        params = JSON.stringify(paramsObj); 

        getDataFromAPI({
            type:'POST',
            url:'visa/getOrderDetail',
            data:params,
            success:(data)=>{
                if(data.code === "1"){

                    console.log(data);

                    let newData = data.data;
                    let stateId = parseInt(newData.statusList[0].statusId);
                    let newCancelBtn = false;

                    /*  能退款的状态
                        0待支付
                        1已支付
                        19待上传
                        4审核中

                     */
                    if(stateId === 0 || stateId === 1 || stateId === 4 || stateId === 19){
                        newCancelBtn = true;
                    }

                    this.setState({
                        jsonData: newData,
                        AJAXFAILED: false,
                        cancelBtn: newCancelBtn
                    });

                }else{
                    Tips({message:data.message});
                }
            },
            error:(data)=>{
                this.setState({
                    AJAXFAILED:true
                })
            }
        });
    }
    cancelOrderAjax(){
        let params,paramsObj = {};
        paramsObj.orderId = this.state.orderId;//订单编号

        params = JSON.stringify(paramsObj); 

        getDataFromAPI({
            type:'POST',
            url:'visa/cancelOrder',
            data:params,
            success:(data)=>{
                if(data.code === "1"){

                    console.log(data);

                    let newData = data.data;

                    if(newData.flag){
                        window.location="#/visa/cancel";
                        return false; 
                    }

                }else{
                    Tips({message:data.message});
                }
            },
            error:(data)=>{
                this.setState({
                    AJAXFAILED:true
                })
            }
        });
    }
    render(){
        return (
            <div className="mg-fadeInRight">
                {
                    this.state.LOADINGTIP ? (
                        <LoadingTip />
                    ) : (
                        <div className="wrap">
                            <MgHeader data={{
                                gotoBack:true,
                                headerTitle: '订单详情',
                                orderCircle: true
                            }} cancelBtn={this.state.cancelBtn} handleCancelOrder={this.handleCancelOrder.bind(this)} handleTel={this.handleTel.bind(this)} />

                            <div className="content">
                                {
                                    this.state.AJAXFAILED ? <div className="orderajaxwrap" ><AjaxTip /></div> : (
                                        <div>
                                            <ORDERINFO data={this.state.jsonData} orderId={this.state.orderId} noUpload={this.state.cancelBtn} />
                                            <ORDERSTATE data={this.state.jsonData} />
                                        </div>
                                    )
                                }
                            </div>
                            {
                                this.state.telMsg ? <Msg 
                                data={{
                                    text: "确定要拨打芒果客户吗？",
                                    btnOK: <a href={'tel:'+TEL}>确定</a>
                                }} 
                                handleSuccess={this.handleTelSuccess.bind(this)} 
                                handleFailed={this.handleTelFailed.bind(this)} 
                                /> : ''
                                
                            }
                            {
                                this.state.cancelOrderMsg ? <Msg 
                                data={{
                                    text: "确定要取消订单吗？"
                                }} 
                                handleSuccess={this.handleOrderSuccess.bind(this)} 
                                handleFailed={this.handleOrderFailed.bind(this)} 
                                /> : ''
                                
                            }
                        </div>
                    )
                }
            </div>
        )
    }
}

class ORDERINFO extends Component{
    constructor(props){
        super(props)
        this.state = {
            showMore: false,
        };
    }
    componentWillMount(){

    }
    handleMore(){
        let showMore = this.state.showMore ? false : true;
        this.setState({showMore: showMore});
    }
    render(){
        let data = this.props.data;
        return (
            <div className="order-info">
                <ul className="list-ul list-br-b">
                    <li className="list-ul-li">
                        <a href="javascript:;" className="list-ul-li-a"><strong>订单信息</strong><span className={ this.state.showMore ? 'more-order-info' : 'more-order-info triangleToggle'} onClick={this.handleMore.bind(this)}>更多<i className="icon icon-arrow-down">&#xe609;</i><i className="icon icon-arrow-up">&#xe608;</i></span></a>
                    </li>
                </ul>
                <div className={ this.state.showMore ? "order-info-content show" : "order-info-content"}>
                    <div className="order-info-country box-hori">
                        <san className="order-country-img"><ImageBox imageUrl={data.image} /></san>
                        <div className="order-country-info box-hori-1">
                            <dl>
                                <dd className="box-hori"><label>购买份数</label><em className="box-hori-1 text-ellipsis">{data.productNum}份</em></dd>
                                <dd className="box-hori"><label>订单金额</label><em className="box-hori-1 text-ellipsis">￥{data.payPrice}</em></dd>
                                <dd className="box-hori"><label>下单时间</label><em className="box-hori-1 text-ellipsis">{data.createDate}</em></dd>
                                <dd className="box-hori"><label>订&nbsp;单&nbsp;号</label><em className="box-hori-1 text-ellipsis">{data.orderId}</em></dd>
                            </dl>
                        </div>
                    </div>
                </div>
                <div className="order-info-identity cfx">
                    <ul className="list-ul list-br-c">
                        {
                            data.passengerList.map((item,index) => {
                                return  <li className="list-ul-li box-hori" key={index}>
                                            <p className="box-hori-3 text-ellipsis"><label>申请人</label><em>{item.passengerName}</em></p>
                                            <p className="box-hori-3 m-r-10 text-ellipsis"><label>身份</label><em>{item.visaIndentityTypeName}</em></p>
                                            <p className="box-hori-3 text-center text-ellipsis">
                                                {
                                                    this.props.noUpload ? <Link to={'visa/upload?orderId=' + this.props.orderId + '&passengerId=' + item.passengerId} >上传材料</Link> : ''
                                                }
                                            </p>
                                        </li>
                            })
                        }
                        
                    </ul>
                </div>
                <div className={(data.passengerList.length < parseInt(data.productNum) ) ? "order-add-applicants" : "order-add-applicants hide"}>
                    <Link to={'visa/applicants/'+data.orderId}>&nbsp;&nbsp;添加申请人信息</Link>
                </div>
            </div>
        )
    }
}

class ORDERSTATE extends Component{
    constructor(props){
        super(props)
        this.state = {
            showMore: false,
        };
    }
    componentWillMount(){

    }
    handleMore(){
       
    }
    render(){
        let data = this.props.data;
        return (
            <div className="visa-state">
                <h4 className="visa-state-title"><span>签证状态</span></h4>
                <div className="visa-state-path">
                    <ul>
                        {
                            data.statusList.map( (item,index) => {
                                return  <li>
                                            <div className="visa-state-ball">
                                                <em className="visa-state-circle"><i></i></em>
                                                <dl>
                                                    <dt>{CONSTSTATETEXT[parseInt(item.statusId)]}</dt>
                                                    <dd>{item.createTime}</dd>
                                                </dl>
                                            </div>
                                        </li>
                            })
                        }
                    </ul>
                </div>
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

export default connect(mapStateToProps,mapDispatchToProps)(DETAILS);