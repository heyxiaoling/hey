import React,{Component} from 'react';
import {bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import {MgHeader,LoadingTip,AjaxTip} from '../common/component';
import * as MGAction  from '../actions/index';
import {getDataFromAPI,Tips} from '../common/base';
import {Link} from 'react-router';

class NEWAPPLICANTS extends Component{
    constructor(props){
        super(props);
        document.title = this.props.route.name;
        this.state = {
            LOADINGTIP: false,
            AJAXFAILED: false,
            identityListBtn: false,
            jsonData: "",
            orderId: "",
            productCode:"",
            passengerName: "",
            visaIndentityType: "",
            visaIndentityTypeName: "",
        };
    }
    componentWillMount(){

        this.setState({LOADINGTIP:false});

        let orderId = this.props.location.query.orderId;    //订单id
        let productCode = this.props.location.query.productCode; //产品编号
        let passengerName = decodeURI(this.props.location.query.passengerName) || ""; //申请人名字
        let visaIndentityTypeName = decodeURI(this.props.location.query.visaIndentityTypeName) || "";  //申请人身份
        

        console.log(passengerName+ ":" +visaIndentityTypeName);

        this.setState({orderId: orderId, productCode: productCode,passengerName: passengerName, visaIndentityTypeName: visaIndentityTypeName, AJAXFAILED: true},function(){
            this.ajaxAPI();
        });
    }
    handleName(ev){
        let passengerName = ev.target.value;
        this.setState({passengerName: passengerName});
    }
    handleIndentityType(ev){
        console.log(ev.target);
        let visaIndentityTypeName = ev.target.getAttribute('data-value');
        let visaIndentityType = ev.target.getAttribute('data-indentityid');

        this.setState({visaIndentityTypeName: visaIndentityTypeName,visaIndentityType: visaIndentityType},function(){
            this.handleIdentityList();
        });

    }
    handleIdentityList(){
        var newIdentityListBtn = this.state.identityListBtn ? false : true;
        this.setState({identityListBtn: newIdentityListBtn});
    }
    handleSure(){
        this.addPassengerAjax();
    }
    ajaxAPI(){
        let params,paramsObj = {};
        paramsObj.productCode = this.state.productCode;//产品编号

        params = JSON.stringify(paramsObj); 

        getDataFromAPI({
            type:'POST',
            url:'visa/getIndentityTypes',
            data:params,
            success:(data)=>{
                if(data.code === "1"){

                    console.log(data);
                    let newData = data.data;

                    this.setState({
                        jsonData: newData,
                        AJAXFAILED: false
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
    addPassengerAjax(){
        let params,paramsObj = {};

        paramsObj.orderId = this.state.orderId; //订单id
        paramsObj.passengerId = this.state.passengerId; //出行人id
        paramsObj.passengerName =this.state.passengerName; //申请人名字
        paramsObj.visaIndentityType = this.state.visaIndentityType; //出行人身份类型


        params = JSON.stringify(paramsObj); 

        getDataFromAPI({
            type:'POST',
            url:'visa/addOrUpdatePassenger',
            data:params,
            success:(data)=>{
                if(data.code === "1"){

                    console.log(data);
                    let newData = data.data;

                    this.setState({
                        jsonData: newData,
                        AJAXFAILED: false
                    });

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
        let data = this.state.jsonData;
        return (
            <div>
                <div className="mg-fadeInRight">
                    {
                        this.state.LOADINGTIP ? (
                            <LoadingTip />
                        ) : (
                            <div className="wrap">
                                <MgHeader data={{
                                    gotoBack:true,
                                    headerTitle: '新添加申请人',
                                }}  />
                                {
                                    this.state.AJAXFAILED ? <div className="applecants-ajax-wrap"><AjaxTip /></div> : (
                                        <div className="content">
                                            <div className="new-applicants">
                                                <ul className="list-ul list-br-b">
                                                    <li className="list-ul-li">
                                                        <a href="javascript:;" className="list-ul-li-a box-hori">
                                                            <label>中文姓名</label>
                                                            <p className="box-hori-1"><input type="text" className="name" placeholder="请输入与身份证一致的姓名" onChange={this.handleName.bind(this)} value={this.state.passengerName} /></p>
                                                        </a>
                                                    </li>
                                                    <li className="list-ul-li">
                                                        <a href="javascript:;" className="list-ul-li-a  box-hori">
                                                            <label>身份证明</label>
                                                            <p className="visaindentitytype box-hori-1">{this.state.visaIndentityTypeName}</p>
                                                            <span className="identity" onClick={this.handleIdentityList.bind(this)}><i className="icon icon-arrow-down">&#xe609;</i></span>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="new-applicants-sure" onClick={this.handleSure.bind(this)}>确定</div>
                                        </div>
                                    )
                                }
                            </div>
                        )
                    }
                </div>
                {
                    this.state.AJAXFAILED ? <div className="applecants-ajax-wrap"><AjaxTip /></div> : (
                        <div className={this.state.identityListBtn ? "identity-list show" : "identity-list"}>
                            <div className="identity-list-bg mask box-opin" onClick={this.handleIdentityList.bind(this)}></div>
                            <ul className="list-ul list-br-c box-bottom-up">
                                {
                                    data.map((item,index) => {
                                        return  <li className="list-ul-li" key={index}>
                                                    <a href="javascript:;" className="list-ul-li-a box-hori" data-value={item.indentityType} onClick={this.handleIndentityType.bind(this)} data-indentityid={item.indentityId}>{item.indentityType}</a>
                                                </li>
                                    })
                                }
                            </ul>
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

export default connect(mapStateToProps,mapDispatchToProps)(NEWAPPLICANTS);