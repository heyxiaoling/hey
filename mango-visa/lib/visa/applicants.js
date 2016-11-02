import React,{Component} from 'react';
import {bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import {MgHeader,LoadingTip,AjaxTip} from '../common/component';
import * as MGAction  from '../actions/index';
import {getDataFromAPI,Tips} from '../common/base';
import {Link} from 'react-router';

class APPLICANTS extends Component{
    constructor(props){
        super(props);
        document.title = this.props.route.name;
        this.state = {
            LOADINGTIP: false,
            AJAXFAILED: false,
            orderId: "",
        };
    }
    componentWillMount(){

        this.setState({LOADINGTIP:false});

        let orderId = this.props.params.id;

        this.setState({orderId:orderId,AJAXFAILED:true},function(){
            this.ajaxAPI();
        });
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
    render(){
        let data = this.state.jsonData;
        return (
            <div className="mg-fadeInRight">
                {
                    this.state.LOADINGTIP ? (
                        <LoadingTip />
                    ) : (
                        <div className="wrap">
                            <MgHeader data={{
                                gotoBack:true,
                                headerTitle: '申请人列表',
                            }}  />
                            {
                                this.state.AJAXFAILED ? <div className="applecants-ajax-wrap"><AjaxTip /></div> : (
                                    <div className="content">
                                        <div className="add-applicants">
                                            <div className="add-applicants-list">
                                                <ul className="list-ul list-br-t">
                                                    {
                                                        data.passengerList.map( (item,index) => {
                                                            return  <li className="list-ul-li" key={index}>
                                                                        <div className="applicants-list box-hori">
                                                                            <div className="applicantsvisaIndentityType-list-checked checked" data-name={item.passengerName} data-id={this.state.orderId} data-passengerId={item.passengerId} data-visaIndentityType={item.visaIndentityType} >
                                                                                <i className="icon icon-checked">&#xe603;</i>
                                                                                <i className="icon icon-no-checked">&#xe604;</i>
                                                                            </div>
                                                                            <div className="applicants-list-info box-hori-1">
                                                                                <label>{item.passengerName}</label><em>{item.visaIndentityTypeName}</em>
                                                                            </div>
                                                                            <div className="applicants-list-edit">
                                                                                <Link to={'visa/newapplicants?orderId=' + this.state.orderId + '&productCode=' + data.productCode + "&passengerName=" + encodeURI(item.passengerName) + '&visaIndentityTypeName=' + encodeURI(item.visaIndentityTypeName)}><i className="icon icon-edit">&#xe605;</i></Link>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                        } )
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="add-applicants-info">
                                            {
                                                (data.passengerList.length < parseInt(data.productNum)) ? <Link to={'visa/newapplicants?orderId=' + this.state.orderId + '&productCode=' + data.productCode}>+&nbsp;&nbsp;新增申请人</Link> : ''
                                            }
                                        </div>
                                    </div>
                                )
                            }
                            
                        </div>
                    )
                }
                {
                   
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

export default connect(mapStateToProps,mapDispatchToProps)(APPLICANTS);