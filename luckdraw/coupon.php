<?php 
    session_start();
    $url = "http://mt.mangocity.com/act/index.php?c=weichat_oauth2&m=OpenAccess ";
    if(!isset($_SESSION['openid'])){
        Header("Location: $url");
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="format-detection" content="telephone=no">
    <meta name="description" content="">
    <meta name="keywords" content="">
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
    <meta name="renderer" content="webkit">
    <meta http-equiv="Cache-Control" content="no-siteapp"/>
    <title>“芒果十年 倾情回馈”</title>
    <link rel="stylesheet" href="css/draw.css?v=13">
</head>
<body>
   <div class="loading" id="loading">
        <div class="loading-bg"></div>
        <p><span></span></p>
    </div>
    <div class="coupon">
        <div class="no-draw"></div>
        <ul class="coupon-ul">
            <!-- <li>
                <div class="card coupon-card">
                    <div class="card-price">
                        <strong><i>￥</i><item>500</item></strong>
                        <span>环球旅游卡<br/>优惠券</span>
                        <em>注销</em>
                    </div>
                    <div class="card-time">有效期：2016年8月1日—9月/1日</div>
                </div>
            </li> -->
        </ul>
    </div>
   
    <script type="text/javascript" src="build/common.js?v=14"></script> 
    <script type="text/javascript" src="build/coupon.js?v=14"></script> 
</body>
</html>