/*
Copyright © 2000 Alber Sanchez <albhasan@gmail.com>
This work is free. You can redistribute it and/or modify it under the
terms of the Do What The Fuck You Want To Public License, Version 2,
as published by Sam Hocevar. See the COPYING file for more details.
*/


function isUrlOfImage(testUrl){
	return /^.*\.(jpg|JPG|jpeg|JPEG|gif|GIF|bmp|BMP)$/.test(testUrl);
}

function padNumber(number, size) {
    var res = "0000000000" + number;
    return res.substr(res.length - size);
}	

function roundNumber(number, places) {
    var multiplier = Math.pow(10, places);
    return (Math.round(number * multiplier) / multiplier);
}

function trasposeArray(anArray){
	var res = anArray.slice(0);//Clone array
	for (var i = 0; i < res.length; i++) {
	  for (var j = 0; j < i; j++) {
		var temp = res[i][j];
		res[i][j] = res[j][i];
		res[j][i] = temp;
	  }
	}
	return res;
}

//http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function xySwap(xyArray){
	var res = new Array();
	for(var i = 0; i < xyArray.length; i++){
		var xy = xyArray[i];
		var x = xy[0];
		var y = xy[1];
		var yx = new Array();
		yx.push(y);
		yx.push(x);
		res.push(yx);
	}
	return res;
}

function calculatePolygonArea(xyArray){
	var res;
	var isClosed = false;
	var pointCount = xyArray.length;
	if(pointCount > 2){
		if(xyArray[0][0] == xyArray[pointCount - 1][0] && xyArray[0][1] == xyArray[pointCount - 1][1]){
			isClosed = true;
		}
		var l2r = 0;
		var r2l = 0;
		for(var i = 1; i < pointCount; i++){
			var l2rTmp = xyArray[i - 1][0] * xyArray[i][1];
			var r2lTmp = xyArray[i][0] * xyArray[i-1][1];
			l2r = l2r + l2rTmp;
			r2l = r2l + r2lTmp;
		}
		if(isClosed == false){
			var l2rTmp = xyArray[pointCount - 1][0] * xyArray[0][1];
			var r2lTmp = xyArray[0][0] * xyArray[pointCount-1][1];
			l2r = l2r + l2rTmp;
			r2l = r2l + r2lTmp;
		}
		res = (l2r - r2l) / 2;
	}
	return res;
}