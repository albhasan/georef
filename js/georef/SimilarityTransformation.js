/*
Copyright © 2000 Alber Sanchez <albhasan@gmail.com>
This work is free. You can redistribute it and/or modify it under the
terms of the Do What The Fuck You Want To Public License, Version 2,
as published by Sam Hocevar. See the COPYING file for more details.
*/

function SimilarityTransformation(xyArraySource, xyArrayDestination){

	//orthogonal axis
	//Axes have the same scale (not suitable for georef!)

	
	var that = this;
	var c = new Coords();
	var xyArrayFrom;
	var xyArrayTo;
	var parameters;
	
	if(xyArraySource.length == xyArrayDestination.length && xyArraySource.length > 1){//at least 2 points
		xyArrayFrom = xyArraySource;
		xyArrayTo  = xyArrayDestination;
		parameters = calculateParameters(xyArrayFrom, xyArrayTo);
	}
	
	

	//---------------------------------------------------------
	//PRIVATE
	//---------------------------------------------------------
	
	function buildA(xyArray){
		var res = new Array();
		for(var i = 0; i < xyArray.length; i++){
			var xy = xyArray[i];
			var x = xy[0];
			var y = xy[1];
			               //a0 b0 a  b
			var tmp1 = Array(1, 0, x, y);
			var tmp2 = Array(0, 1, y, -x);
			res.push(tmp1);
			res.push(tmp2);
		}
		return res;
	}

	function buildL(xyArray){
		var res = new Array();
		for(var i = 0; i < xyArray.length; i++){
			var xy = xyArray[i];
			var x = xy[0];
			var y = xy[1];
			res.push(x);
			res.push(y);
		}
		return res;
	}

	
	//Similarity transformation
	function calculateParameters(xyArrayFrom, xyArrayTo){
		var res = new Array();
		var Aarray = buildA(xyArrayFrom);
		var Larray = buildL(xyArrayTo);
		res = c.leastSquaresShortNoWeight(Aarray, Larray);
		return res;
	}
	
	
	//---------------------------------------------------------
	//PRIVILEGED
	//---------------------------------------------------------
	this.getXyArraySource = function(){
		return xyArraySource;
	}	
	this.getXyArrayDestination = function(){
		return xyArrayDestination;
	}
	this.getParameters = function(){
		return parameters;
	}
	
	this.transform = function(xSource, ySource){
		var res = new Array();
		//a0 b0 a b
		var a0 = parameters[0];
		var b0 = parameters[1]; 
		var a =  parameters[2];
		var b =  parameters[3];
		var xTo = a0 + a * xSource + b * ySource;
		var yTo = b0 - b * xSource + a * ySource;
		res.push(xTo);
		res.push(yTo);
		return res;
	}
	
}