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
    <div class="draw">
        <a href="coupon.php" alt="中奖纪录">中奖纪录</a>
        <ul class="content">
            <li><input type="text" placeholder="请输入手机号码" id='textInput'></li>
            <li><span id="spanSub">立即抽奖&nbsp;&nbsp;&gt;</span></li>
        </ul>
    </div>
    <div class="mask" id="popup-mask"></div>
    <div class="popup" id="popup">
        <span class="card-close" id="card-close">×</span>
        <div class="card">
            <div class="card-price">
                <strong><i>￥</i><item class="prizetype">&nbsp;</item></strong>
                <span>环球旅游卡<br/>优惠券</span>
            </div>
            <div class="card-time">&nbsp;</div>
        </div>
        <a href="coupon.php" alt="">立即领取&nbsp;&gt;</a>
    </div>
    <script type="text/javascript" src="build/common.js?v=14"></script>
    <script type="text/javascript" src="build/draw.js?v=14"></script>
</body>
</html>
