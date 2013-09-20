/*
Copyright © 2000 Alber Sanchez <albhasan@gmail.com>
This work is free. You can redistribute it and/or modify it under the
terms of the Do What The Fuck You Want To Public License, Version 2,
as published by Sam Hocevar. See the COPYING file for more details.
*/

function SimilarityTransformation(xyArraySource, xyArrayDestination){

	//orthogonal axis
	//Axes have the same scale (not suitable for georef but for a fist approximation to query DBpedia for suggestions!)

	
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
	
	/**
	* Builds the matrix A
	* @param xyArray - Array made of [x,y] arrays where x and y are numbers
	* @returns An array resemblig the matrix A for a similarity transformation
	*/
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

	/**
	* Builds the vector L
	* @param xyArray - Array made of [x,y] arrays where x and y are numbers
	* @returns An array resemblig the vector L for a similarity transformation
	*/
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

	
	/**
	* Similarity transformation
	* @param xyArrayFrom - Array made of [x,y] in the image
	* @param xyArrayTo - Array made of [x,y] in the reference map
	* @returns An array with the results of the least squares adjustment
	*/
	function calculateParameters(xyArrayFrom, xyArrayTo){
		var res = new Array();
		var Aarray = buildA(xyArrayFrom);
		var Larray = buildL(xyArrayTo);
		res = c.leastSquaresShortNoWeight(Aarray, Larray);
		return res;
	}
	
	/**
	* Calculates the parameters for reversing the transformation
	* @returns An array of parameters
	*/
	function reverseParameters(){
		var res = new Array();
		
		var a0 = parameters[0];
		var b0 = parameters[1]; 
		var a =  parameters[2];
		var b =  parameters[3];
		
		var C = Math.pow(a,2) + Math.pow(b,2);
		var a_p = a / C;
		var b_p = -1 * b / C;
		var a0_p = (b * b0 - a * a0) / C;
		var b0_p = -1 * (b * a0 + a * b0) / C;
		
		res.push(a_p);
		res.push(b_p);
		res.push(a0_p);
		res.push(b0_p);
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
	
	/*this.transform = function(xSource, ySource){
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
	}*/

	/**
	* Applies the transformation to the input points
	* @param xyArray - Array made of [x,y] 
	* @returns An array made of [x,y]  with the resulting coordinates
	*/
	this.transform = function(xyArray){
		var res = new Array();
		//a0 b0 a b
		var a0 = parameters[0];
		var b0 = parameters[1]; 
		var a =  parameters[2];
		var b =  parameters[3];
		for(var i = 0; i < xyArray.length; i++){
			var xy = xyArray[i];		
			var xTo = a0 + a * xy[0] + b * xy[1];
			var yTo = b0 - b * xy[0] + a * xy[1];
			var tmp = new Array();
			tmp.push(xTo);
			tmp.push(yTo);
			res.push(tmp);
		}
		return res;
	}

	/*this.transformReverse = function(xTo, yTo){
		var res = new Array();
		
		var revPar = reverseParameters();
		var a_p = revPar[0];
		var b_p = revPar[1];
		var a0_p = revPar[2];
		var b0_p = revPar[3];
		
		var xFrom = a0_p + a_p * xTo + b_p * yTo;
		var yFrom = b0_p - b_p * xTo + a_p * yTo;
		res.push(xFrom);
		res.push(yFrom);
		return res;
	}*/
	
	
	/**
	* Applies the reverse transformation to the input points
	* @param xyArray - Array made of [x,y] 
	* @returns An array made of [x,y]  with the resulting coordinates
	*/
	this.transformReverse = function(xyArray){
		var res = new Array();
		
		var revPar = reverseParameters();
		var a_p = revPar[0];
		var b_p = revPar[1];
		var a0_p = revPar[2];
		var b0_p = revPar[3];

		for(var i = 0; i < xyArray.length; i++){
			var xy = xyArray[i];		
			var xFrom = a0_p + a_p * xy[0] + b_p * xy[1];
			var yFrom = b0_p - b_p * xy[0] + a_p * xy[1];
			var tmp = new Array();
			tmp.push(xFrom);
			tmp.push(yFrom);
			res.push(tmp);
		}
		return res;
	}
	
}