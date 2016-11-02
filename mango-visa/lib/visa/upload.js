import React,{Component} from 'react';
import {bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import {MgHeader,LoadingTip,AjaxTip} from '../common/component';
import * as MGAction  from '../actions/index';
import {getDataFromAPI,Tips,getBlob,getFormData,compress} from '../common/base';
import {Link} from 'react-router';

const LOADURL = 'http://fileservice.mangocity.cn/apis/fileUpload';

class UPLOAD extends Component{
    constructor(props){
        super(props);
        document.title = this.props.route.name;
        this.state = {
            LOADINGTIP: false,
            AJAXFAILED: false,
            jsonData: null,
            orderId: '',
            passengerId: '',
            imgboxBtn: false,
            img: [],
            imgPath: [],
        };
    }
    componentWillMount(){
        let orderId = decodeURI(this.props.location.query.orderId);    //订单id
        let passengerId = decodeURI(this.props.location.query.passengerId); //产品id
        console.log(orderId+":"+passengerId);
        this.setState({orderId: orderId, passengerId: passengerId, AJAXFAILED: true},function(){
            this.ajaxAPI();
        });
    }
    componentDidMount(){  
    }
    handleLoadImg(ev){
        let _this = this;
        let files = ev.target.files,
            fileslength = files.length;

        if(!fileslength) return;

        files = Array.prototype.slice.call(files);
        

        if(fileslength > 9){
            Tips({message:"最多同时只可上传9张图片"});
            _this.setState({imgboxBtn: false});
            return;
        }

        files.forEach(function(file, i){
            let fName = file.name;
            console.log(fName);

            if (!/\/(?:jpeg|png|gif)/i.test(file.type)){
                Tips({message:"请上传图片"});
                _this.setState({imgboxBtn: false});
                return;
            }

            let reader = new FileReader();
            
            //获取图片大小
            let size = file.size / 1024 > 1024 ? (~~(10 * file.size / 1024 / 1024)) / 10 + "MB" : ~~(file.size / 1024) + "KB";
            
            reader.onload = function(){
                console.log(this);
                let result = this.result,
                    imgInfo = [],
                    num,
                    maxsize = 100 * 1024;

                let img = new Image();
                img.src = result;
                imgInfo.src = result;
                imgInfo.pecent = 50;

                _this.state.img.push(imgInfo);

                num = _this.state.img.length - 1;

                if(fileslength === i){
                    _this.setState({img:_this.state.img});
                    console.log(_this.state.img);
                }
                
                
                //如果图片大小小于100kb，则直接上传
                if(result.length <= maxsize){
                    img = null;
                    _this.upload(result, file.type, num, fName);
                    return;
                }

                // 图片加载完毕之后进行压缩，然后上传
                if(img.complete){
                    callback();
                }else{
                    img.onload = callback;
                }

                function callback(){
                    let data = compress(img);
                    console.log(data);
                    _this.upload(data, file.type, num, fName);
                    img = null;
                }

            };

            reader.readAsDataURL(file);
        });
    }
    upload(basestr, type, num, fName){
        //图片上传，将base64的图片转成二进制对象，塞进formdata上传
        let _this = this,
            pecent = 0,
            loop = null;

            console.log(basestr.split(",")[1]);
            
        _this.setState({imgboxBtn: true});

        let text = window.atob(basestr.split(",")[1], {type:'text/html'});
        let buffer = new Uint8Array(text.length);
        
        for(var i = 0; i < text.length; i++){
            buffer[i] = text.charCodeAt(i);
        }

        let blob = getBlob([buffer], type);

        let xhr = new XMLHttpRequest();

        let formdata = getFormData();21

        formdata.append('file',blob,fName);

        xhr.open('post', LOADURL);

        xhr.onreadystatechange = function() {
            if(xhr.readyState == 4 && xhr.status == 200){
                let jsonData = JSON.parse(xhr.responseText),
                    imagedata = jsonData.result || {},
                    text = imagedata.imagePath ? '上传成功' : '上传失败';
                
                console.log(jsonData);

                console.log(text + '：' + imagedata.imagePath);

                _this.state.imgPath.push(imagedata.imagePath);

                _this.state.img[num].pecent = 100;

                _this.setState({img: _this.state.img, imgPath: _this.state.imgPath});

                console.log(_this.state.imgPath);

                clearInterval(loop);

                //当收到该消息时上传完毕
                if (!imagedata.imagePath) return;
            }else{
                // Tips({message: fName + "图片上传失败"});
            }
        };

        //数据发送进度，前50%展示该进度
        xhr.upload.addEventListener('progress', function(e){
            if (loop) return;
            pecent = ~~(100 * e.loaded / e.total) / 2;
            _this.state.img[num].pecent = pecent;
            _this.setState({img: _this.state.img});

            if(pecent == 50){
                mockProgress();
            }
        }, false);

        //数据后50%用模拟进度
        function mockProgress() {
            if (loop) return;
            loop = setInterval(function() {
                pecent++;
                _this.state.img[num].pecent = pecent;
                _this.setState({img: _this.state.img});
                if(pecent == 99){
                    clearInterval(loop);
                }
            }, 100)
        }

        xhr.send(formdata);
    }
    ajaxAPI(){
        let params,paramsObj = {};
        paramsObj.orderId = this.state.orderId;//订单号
        paramsObj.passengerId = this.state.passengerId; //乘客id
        params = JSON.stringify(paramsObj); 
        getDataFromAPI({
            type:'POST',
            url:'visa/getIdentityStatus',
            data:params,
            success:(data)=>{
                console.log(data);
                if(data.code === "1"){
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
    handleSureUpload(){
        let params,paramsObj = {};
        paramsObj.orderId = this.state.orderId;//订单号
        paramsObj.passengerId = this.state.passengerId; //乘客id
        paramsObj.certList = this.state.imgPath; //乘客id

        params = JSON.stringify(paramsObj); 
        getDataFromAPI({
            type:'POST',
            url:'visa/confirmUploadFiles',
            data:params,
            success:(data)=>{
                console.log(data);
                if(data.code === "1"){
                    

                }else{
                    Tips({message:data.message});
                }
            },
            error:(data)=>{
                Tips({message:data});
            }
        });
    }
    handleCancelUpload(){

    }
    render(){
        let jsonData = this.state.jsonData;
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
                                    headerTitle: '材料上传',
                                }}  />
                                {
                                    this.state.AJAXFAILED ? <div className="applecants-ajax-wrap"><AjaxTip /></div> : (
                                        <div className="content">
                                            <div className="upload-tips">
                                                <span></span>
                                            </div>
                                            <div className="upload-split"></div>
                                            <div className="content">
                                                <div className="mg-file-info clr">
                                                    <ul className="list-ul  list-br-c">
                                                        {
                                                            jsonData.identitysStatus.map((item,index)=>{
                                                                return  <li className="list-ul-li" key={index}>
                                                                            <p className="list-ul-li-a">
                                                                                <label className="J_li_title">{}</label>
                                                                                <span  className="icon icon-checked mg-feild-incon">&#xe60c;</span> 
                                                                            </p>
                                                                        </li> 
                                                            })
                                                        }
                                                    </ul>
                                                </div>
                                                <div className="loadimgbtn"> <span>上传图片</span><input type="file" onChange={this.handleLoadImg.bind(this)}  multiple="multiple" /></div>
                                            </div>
                                            <div className="upload-bottom">
                                                <div className="upload-file-btn">
                                                        <div>
                                                            <p className="upload-file-a" >上传完毕,提交材料审核</p>
                                                            <span className="upload-uncompete"></span>
                                                        </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        )
                    }
                </div>
                {
                    this.state.imgboxBtn ? <IMGUPLOAD img={this.state.img} handleLoadImg={this.handleLoadImg.bind(this)} handleSureUpload={this.handleSureUpload.bind(this)} handleCancelUpload={this.handleCancelUpload.bind(this)} /> : ''
                }
            </div>
        )
    }
}

class IMGUPLOAD extends Component{
    constructor(props){
        super(props);
        this.state = {
            
        };
    }
    componentWillMount(){

    }
    componentDidMount(){
        
    }
    render(){
        return (
            <div className="img-load-box">
                <div className="img-load-mask mask"></div>
                <div className="img-load-content">
                    <ul className="img-list">
                        {
                            this.props.img.map((item,index) => {
                                return  <li key={index}>
                                            <img  src={item.src} />
                                            <div className="img-load-progress"><span style={{"width": item.pecent + "%"}}>{item.pecent}%</span></div>
                                            <div className="img-load-size">{}</div>
                                        </li>
                            })
                        }
                        <li className="img-load-btn"><img  src="../i/up-add.png" /><input type="file" onChange={this.props.handleLoadImg.bind(this)}  multiple="multiple" /></li>
                    </ul>
                    <div className="img-load-btnwrap">
                        <span className="img-load-cancel" onClick={this.props.handleCancelUpload.bind(this)}>取消</span>
                        <span  className="img-load-sub" onClick={this.props.handleSureUpload.bind(this)}>确定</span>
                    </div>
                    
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

export default connect(mapStateToProps,mapDispatchToProps)(UPLOAD);