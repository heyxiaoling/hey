import React,{Component} from 'react';
import {bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import {MgHeader,LoadingTip,ImageBox} from '../common/component';
import * as MGAction  from '../actions/index';
import {Link} from 'react-router';

class CANCEL extends Component{
    constructor(props){
        super(props)
        document.title = this.props.route.name
        this.state = {
            LOADINGTIP: false,
            AJAXFAILED: false
        };
    }
    componentWillMount(){
         
    }
    ajaxAPI(){
       
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
                                gotoUrl:'#',
                                headerTitle: '订单取消',
                            }}  />
                            <div className="content">
                                <div className="cancel-order">
                                    <span><ImageBox imageUrl="../i/cancel.png" /></span>
                                    <p>您已经成功取消订单，<br/>客服人员将会与您联系确定退款事宜。</p>
                                </div>
                            </div>
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

export default connect(mapStateToProps,mapDispatchToProps)(CANCEL);