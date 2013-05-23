/*
Copyright © 2000 Alber Sanchez <albhasan@gmail.com>
This work is free. You can redistribute it and/or modify it under the
terms of the Do What The Fuck You Want To Public License, Version 2,
as published by Sam Hocevar. See the COPYING file for more details.
*/


/**
 * Creates an affine transformation
 *
 * @param {Array} xyArraySource Array of number arrays of x and y coordinates
 * @param {Array} xyArrayDestination Array of number arrays of x and y coordinates
 */
function AffineTransformation(xyArraySource, xyArrayDestination){

	var that = this;
	var c = new Coords();
	var xyArrayFrom;
	var xyArrayTo;
	var parameters;

	if(xyArraySource.length == xyArrayDestination.length && xyArraySource.length > 2){//at least 3 points
		xyArrayFrom = xyArraySource;
		xyArrayTo  = xyArrayDestination;
		parameters = calculateParameters(xyArrayFrom, xyArrayTo);
	}
	
	
	//---------------------------------------------------------
	//PRIVATE
	//---------------------------------------------------------
	
	
	
	/**
	 * Builds a matrix suitable for the transformation. https://groups.google.com/forum/?fromgroups#!topic/mapinfo-l/au0j3pSLXHM
	 *
	 * @param {Array} xyArray Array of number arrays of x and y coordinates
	 * @returns {Array} Array of number arrays each one containing [x, y, 1]
	 */
	function buildMatrix(xyArray){
		var res = new Array();
		for(var i = 0; i < xyArray.length; i++){
			var tmp = new Array();
			var xy = xyArray[i];
			var x = xy[0];
			var y = xy[1];
			tmp.push(x);
			tmp.push(y);
			tmp.push(1);
			res.push(tmp);
		}
		return res;
	}
	
	/**
	 * Calculate the parameters of the transformation. https://groups.google.com/forum/?fromgroups#!topic/mapinfo-l/au0j3pSLXHM
	 *
	 * @param {Array} xyArrayFrom Array of number arrays of x and y coordinates
	 * @param {Array} xyArrayTo Array of number arrays of x and y coordinates
	 * @returns {Array} Array of numbers containing the transformation parameters
	 */
	function calculateParameters(xyArrayFrom, xyArrayTo){
		var res = new Array();
		var Aarray = buildMatrix(xyArrayFrom);
		var Barray = buildMatrix(xyArrayTo);
		res = c.perspectivity(Aarray, Barray);
		return res;
	}

	//---------------------------------------------------------
	//PRIVILEGED
	//---------------------------------------------------------

	/**
	 * Returns the array of xy coordinates of the source
	 *
	 * @returns {Array} Array of numbers containing x y coordinates
	 */
	this.getXyArraySource = function(){
		return xyArraySource;
	}	
	
	/**
	 * Returns the array of xy coordinates of the destination
	 *
	 * @returns {Array} Array of numbers containing x y coordinates
	 */
	this.getXyArrayDestination = function(){
		return xyArrayDestination;
	}
	
	/**
	 * Returns the array of parametes of the transformation
	 *
	 * @returns {Array} Array of parameters
	 */
	this.getParameters = function(){
		return parameters;
	}
	
	/**
	 * Returns the xy coordinates in the destination reference system
	 *
	 * @param {Number} xSource x coordinate in the source reference system
	 * @param {Number} ySource y coordinate in the source reference system
	 * @returns {Array} Array of x and y in the destination reference system
	 */
	this.transform = function(xSource, ySource){
		var res = new Array();
		var A = parameters[0][0];
		var B = parameters[0][1];
		var C = parameters[0][2];
		var D = parameters[1][0];
		var E = parameters[1][1];
		var F = parameters[1][2];
		
		var xTo = A * xSource + B * ySource + C;
		var yTo = D * xSource + E * ySource + F;
		res.push(xTo);
		res.push(yTo);
		return res;
	}

	this.transform = function(xyArray){
		var res = new Array();
		var A = parameters[0][0];
		var B = parameters[0][1];
		var C = parameters[0][2];
		var D = parameters[1][0];
		var E = parameters[1][1];
		var F = parameters[1][2];
		
		for(var i = 0; i < xyArray.length; i++){
			var xy = xyArray[i];
			var xTo = A * xy[0] + B * xy[1] + C;
			var yTo = D * xy[0] + E * xy[1] + F;
			var tmp = new Array();
			tmp.push(xTo);
			tmp.push(yTo);
			res.push(tmp);
		}
		return res;
	}
	
}


