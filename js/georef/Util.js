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
	//if(res < 0){}//Clockwise polygon
	return Math.abs(res);
}

function getBoundary(xyArray){
	var xMin = Infinity;
	var yMin = Infinity;
	var xMax = -Infinity;
	var yMax = -Infinity;

	for(var i = 0; i < xyArray.length; i++){
		var xy = xyArray[i];
		var xMin = (xMin > xy[0]) ? xy[0] : xMin;
		var yMin = (yMin > xy[1]) ? xy[1] : yMin;
		var xMax = (xMax < xy[0]) ? xy[0] : xMax;
		var yMax = (yMax < xy[1]) ? xy[1] : yMax;
	}
	var res = new Array(xMin, yMin, xMax, yMax);
	return res;	
}

function zoomToSuggestion(lng, lat){
	map.panTo(new L.LatLng(lat, lng));
	//
	if(trans != null){
		var tmp = new Array(new Array(lng, lat));
		var imgCoords = trans.transformReverse(tmp);
		var imgScaledCoords = imgModelScaled.scaleCoords(imgCoords[0][0], imgCoords[0][1]);
		mapImage.panTo(new L.LatLng(imgScaledCoords[1], imgScaledCoords[0]));
	}
	
}	

function xyProject(xyArray, proj){
	var res = new Array();
	for(var i = 0; i < xyArray.length; i++){
		var xy = xyArray[i];
		var ll = new L.LatLng(xy[1], xy[0]);
		var p = proj.project(ll);//Leaflet doesn't make transformations!!! http://leafletjs.com/reference.html#icrs
		var tmp = new Array(p.x, p.y);
		res.push(tmp);
	}
	return res;
}

function latlon2xyArray(latlonArray){
	var res = new Array();
	for(var i = 0; i < latlonArray.length; i++){
		var ll = latlonArray[i];
		var tmpCoords = new Array(ll.lng, ll.lat);
		res.push(tmpCoords);
	}
	return res;
}

function xyArray2latlon(xyArray){
	var res = new Array();
	for(var i = 0; i < xyArray.length; i++){
		var xy = xyArray[i];
		var latlng = new L.LatLng(xy[1], xy[0]);
		res.push(latlng);
	}
	return res;
}

function point2xyArray(pointArray){
	var res = new Array();
	for(var i = 0; i < pointArray.length; i++){
		var p = pointArray[i];
		var tmpCoords = new Array(p.x, p.y);
		res.push(tmpCoords);
	}
	return res;
}

function xyArray2point(xyArray){
	var res = new Array();
	for(var i = 0; i < xyArray.length; i++){
		var xy = xyArray[i];
		var point = new L.Point(xy[0], xy[1]);
		res.push(point);
	}
	return res;
}



function latLngArrayDistance(latlonArray){
	var res = 0;
	for(var i = 1; i < latlonArray.length; i++){
		var ll0 = latlonArray[i - 1];
		var ll1 = latlonArray[i];
		res = res + ll0.distanceTo(ll1);
	}
	return res;//Meters
}

function pointArrayDistance(pointArray){
	var res = 0;
	for(var i = 1; i < pointArray.length; i++){
		var p0 = pointArray[i - 1];
		var p1 = pointArray[i];
		res = res + p0.distanceTo(p1);
	}
	return res;
}