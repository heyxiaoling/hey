import React,{Component} from 'react';
import {bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import {MgHeader,ImageBox,LoadingTip,AjaxTip} from '../common/component';
import {getDataFromAPI,orderAjax,Tips,checkLogin,getMbrInfo} from '../common/base';
import * as MGAction  from '../actions/index';
import {Link} from 'react-router';

class DETAILS extends Component{
    constructor(props){
        super(props)
        document.title = this.props.route.name
        this.state = {
            LOADINGTIP: false,
            AJAXFAILED: false,
            jsonData: null,
        };
    }
    componentDidMount(){
        
    }
    componentWillMount(){

        this.setState({AJAXFAILED:true},function(){
            this.ajaxAPI();
        })
    }
    handleAddressChange(ev){
        console.log(ev.target.value);
        window.location.href = '#/visa/address/' + ev.target.value;
    }
    ajaxAPI(){
        let params,paramsObj = {};
        params = JSON.stringify(paramsObj); 

        // getDataFromAPI({
        //     type:'POST',
        //     url:'visa/getVisaIndex',
        //     data:params,
        //     success:(data)=>{
        //         if(data.code === "1"){
        //             console.log(data);
        //             let newData = data.data;
        //             this.setState({
        //                 jsonData: newData,
        //                 AJAXFAILED: false
        //             });

        //         }else{
        //             Tips({message:data.message});
        //         }
        //     },
        //     error:(data)=>{
        //         this.setState({
        //             AJAXFAILED:true,
        //             scrollBtn: true
        //         })
        //     }
        // });
        orderAjax('visa/getVisaIndex',params,function(data){
            console.log(data);
            let newData = data.data;
            this.setState({
                jsonData: newData,
                AJAXFAILED: false
            });
        }.bind(this));
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
                                headerTitle: '首页',
                            }}  />
                            <div className="content">
                                {
                                    this.state.AJAXFAILED ? <div className="indexajaxwrap" ><AjaxTip /></div> : (
                                        <div>
                                            <SLIDERLIST data={this.state.jsonData} />
                                            <section className="index-search">
                                                <div className="index-search"><input type="text" className="index-search-input" onChange={this.handleAddressChange.bind(this)} placeholder="&nbsp;请输入出境国家名称或关键字" readonly="readonly" /></div>
                                            </section>
                                            <HOTCITYLIST data={this.state.jsonData} />
                                            <LIKECITYLIST data={this.state.jsonData} />
                                        </div>
                                    )
                                }
                            </div>
                            <Footer />
                        </div>
                        
                    )
                }
            </div>
        )
    }
}

class SLIDERLIST extends Component{
    constructor(props){
        super(props);
    }
    componentDidMount(){
        var swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            paginationClickable: true,
            speed: 1000,
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev',
            paginationClickable: true,
            centeredSlides: true,
            autoplay: 2000,
            autoplayDisableOnInteraction: false
        });
    }
    render(){
        let data = this.props.data.images;
        return (
            <div className="swiper-container">
                <div className="swiper-wrapper" id="swiper-wrapper">
                    {
                        data.map((item,index)=>{
                            return  <div className='swiper-slide index-slide' key={index}>
                                        <img className='title_pic' src={item.imageUrl} name={item.tag} />
                                    </div>
                        })
                    }
                </div>
                <div className="swiper-pagination"></div>
            </div>
        )
    }
}


class HOTCITYLIST extends Component{
    constructor(props){
        super(props);
    }
    render(){
        let data = this.props.data.hot;
        return (
            <section className="hot-city">
                <h4>
                    <span>大家都在去</span>
                    <Link to={'visa/details'}>更多></Link>
                </h4>
                <div className="hot-city-list">
                    <ul>
                        {
                            data.map((item,index)=>{
                                return  <li className="" key={index}>
                                            <Link to={'visa/orderlist/2'} data-countryId={item.countryId}>
                                                <ImageBox imageUrl={item.image} />
                                                <em>{item.name}</em>
                                            </Link>
                                        </li>
                            })
                        }
                    </ul>
                </div>
            </section>
        )
    }
}


class LIKECITYLIST extends Component{
    constructor(props){
        super(props);
    }
    render(){
        let data = this.props.data.recommend;
        return (
            <section className="like-city">
                <h4>
                    <span>也许你喜欢</span>
                </h4>
                <div className="like-city-list">
                    <ul>
                        {
                           data.map((item,index)=>{
                                return  <li className="cfx">
                                            <div className="like-city-list-pic">
                                                <ImageBox imageUrl={item.image} />
                                            </div>
                                            <div className="like-city-list-info fl">
                                                <div className="like-city-list-info-title">{item.name}</div>
                                                <div className="like-city-list-info-bottom">￥<span>{item.price}</span></div>
                                            </div>
                                        </li>
                            }) 
                        }
                        
                    </ul>
                </div>
                <div className="no-more-like-city">没有更多了</div>
            </section>
        )
    }
}


class Footer extends Component{
    constructor(props){
        super(props);
    }
    componentDidMount(){
    }
    render(){
        
        return (
            <footer>
                <section className="foot-nav">
                    <a href="/">
                        <dl>
                            <dt className="icon icon-home">&#xe621;</dt>
                            <dd>主页</dd>
                        </dl>
                    </a>
                    <a href="http://mt.mangocity.com/views/order/orderlist.html">   
                        <dl>
                           <dt className="icon icon-home">&#xe61b;</dt>
                           <dd>订单</dd>
                        </dl>
                    </a>    
                    <a href="/views/user/login.html">
                        <dl>
                            <dt className="icon icon-home">&#xe61e;</dt>
                            <dd>我的</dd>
                        </dl>
                    </a>
                    <a href="/about.html">
                        <dl>
                            <dt className="icon icon-home">&#xe61f;</dt>
                            <dd>关于</dd>
                        </dl>
                    </a>
                </section>
                <ul className="foot-nav-bottom">
                    <li><a href="http://www.mangocity.com/1/index.html">下载客户端</a></li>
                    <li><a href="http://www.mangocity.com/">电脑版</a></li>
                </ul>
                <div className="foot-copyright">Copyright © 2005-2016</div>
            </footer>
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