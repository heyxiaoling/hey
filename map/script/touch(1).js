//返回角度
function GetSlideAngle(dx, dy) {
    return Math.atan2(dy, dx) * 180 / Math.PI;
}
 
//根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
function GetSlideDirection(startX, startY, endX, endY) {
    var dy = startY - endY;
    var dx = endX - startX;
    var result = 0;
 
    //如果滑动距离太短
    if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
        return result;
    }
 
    var angle = GetSlideAngle(dx, dy);
    if (angle >= -45 && angle < 45) {
        result = 4;
    } else if (angle >= 45 && angle < 135) {
        result = 1;
    } else if (angle >= -135 && angle < -45) {
        result = 2;
    }
    else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
        result = 3;
    }
 
    return result;
}
//滑动处理
function touchScroll(obj,fn){
	var startX, startY;
	obj.addEventListener('touchstart', function (e) {
		startX = event.touches[0].pageX;
		startY = event.touches[0].pageY;   
	}, false);
	obj.addEventListener('touchmove', function (e) {
		var endX, endY;
		endX = event.changedTouches[0].pageX;
		endY = event.changedTouches[0].pageY;
		var direction = GetSlideDirection(startX, startY, endX, endY);
		var movex=endX-startX;
		switch (direction) {
			case 0:
				//alert("没滑动");
				break;
			case 1:
				//alert("向上");
				break;
			case 2:
				//alert("向下");
				break;
			case 3:
				//alert("向左");
				if(fn.leftmove) fn.leftmove(movex);
				event.preventDefault();
				break;
			case 4:
				//alert("向右");
				if(fn.rightmove) fn.rightmove(movex);
				event.preventDefault();
				break;
			default:            
		}   
	}, false);
	obj.addEventListener('touchend', function (e) {
		var endX, endY;
		endX = event.changedTouches[0].pageX;
		endY = event.changedTouches[0].pageY;
		var direction = GetSlideDirection(startX, startY, endX, endY);
		switch (direction) {
			case 0:
				if(fn.notouch) fn.notouch();
				break;
			case 1:
				//alert("向上");
				break;
			case 2:
				//alert("向下");
				break;
			case 3:
				//alert("向左");
				if(fn.leftend) fn.leftend();
				event.preventDefault();
				break;
			case 4:
				//alert("向右");
				if(fn.rightend) fn.rightend();
				event.preventDefault();
				break;
			default:            
		}
	}, false);
		
}
