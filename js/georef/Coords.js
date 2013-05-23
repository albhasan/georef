/*
Copyright © 2000 Alber Sanchez <albhasan@gmail.com>
This work is free. You can redistribute it and/or modify it under the
terms of the Do What The Fuck You Want To Public License, Version 2,
as published by Sam Hocevar. See the COPYING file for more details.
*/

/**
 * Creates an object for handling coordinate transformations
 *
 */
function Coords(){


	//---------------------------------------------------------
	//PRIVATE
	//---------------------------------------------------------

	
	//---------------------------------------------------------
	//PRIVILEGED
	//---------------------------------------------------------

	/**
	 * Transforms from cartesian coordinates to image coordinates, assuming the image is located in the 4th quadrant
	 *
	 * @param {Number} x x coordinate in cartesian reference system
	 * @param {Number} y y coordinate in cartesian reference system
	 * @returns {Array} Array of numbers x, y
	 */
	this.cartesian2imageCoords = function (x, y){
		var res;
		if(isNumber(x) && isNumber(y)){
			res = new Array();
			res[0] = x;
			res[1] = -y;
		}
		return res;
	}

	/**
	 * Transforms from image coordinates to cartesian coordinates, assuming the image is located in the 4th quadrant
	 *
	 * @param {Number} xImg x coordinate in an image reference system
	 * @param {Number} yImg y coordinate in an image reference system
	 * @returns {Array} Array of numbers x, y
	 */
	this.image2cartesianCoords = function (xImg, yImg){
		var res;
		if(isNumber(xImg) && isNumber(yImg)){
			res = new Array();
			res[0] = xImg;
			res[1] = -yImg;
		}
		return res;
	}
	
	
	/**
	 * Move the coordinates
	 *
	 * @param {Number} x x coordinate
	 * @param {Number} y y coordinate
	 * @param {Number} dx Traslation value in x
	 * @param {Number} dy Traslation value in y
	 * @returns {Array} Array of numbers x, y
	 */
	this.traslation = function(x, y, dx, dy){
		var res;
		if(isNumber(x) && isNumber(y) && isNumber(dx) && isNumber(dy)){
			res = new Array();
			res[0] = x + dx;
			res[1] = y + dy;
		}
		return res;
	}

	
	/**
	 * Calculates the least square assuming all observations have the same weight as described in Datums and map projections for remote sensing, GIS and surveying 2nd edition page 188 E.13. Depends on sylvester for matrix calculation http://sylvester.jcoglan.com/
	 *
	 * @param {Array} Aarray Array of number arrays
	 * @param {Array} lVector Array of number
	 * @returns {Array} Array of number arrays
	 */
	this.leastSquaresShortNoWeight = function(Aarray, lVector){
		
		//Inputs arrays to matrixes
		var A = Matrix.create(Aarray);
		var l = Vector.create(lVector);
		//First part
		var At  = A.transpose();
		var AtA = At.multiply(A);
		var AtA_inv = AtA.inverse();
		//Second part
		var Atl = At.multiply(l);
		//Results calculation
		var resMatrix = AtA_inv.multiply(Atl);
		//Back to arrays
		var res = resMatrix.elements;
		
		return res;
	}	
	
	/**
	 * Calculates the least square assuming all observations have the same weight as described in Datums and map projections for remote sensing, GIS and surveying 2nd edition page 189 E.14. Depends on sylvester for matrix calculation http://sylvester.jcoglan.com/
	 *
	 * @param {Array} Aarray Array of number arrays
	 * @param {Array} Carray Array of number
	 * @param {Array} barray Array of number
	 * @returns {Array} Array of number arrays
	 */
	this.leastSquaresLongNoWeight = function(Aarray, Carray, barray){
		//Inputs arrays to matrixes
		var A = Matrix.create(Aarray);
		var C = Matrix.create(Carray);
		var b = Vector.create(barray);
		
		var At  = A.transpose();
		var Ct  = C.transpose();
		var CCt = C.multiply(Ct);
		var CCtinv = CCt.inverse();
		var AtCCtinv = At.multiply(CCtinv);
		
		//First part
		var AtCCtinvA = AtCCtinv.multiply(A);
		var AtCCtinvAinv = AtCCtinvA.inverse();
		//Second part
		var AtCCtinvb = AtCCtinv.multiply(b);
		
		//Back to arrays
		var resMatrix = AtCCtinvAinv.multiply(AtCCtinvb);
		var res = resMatrix.elements;
		
		return res;
	}
	
	
	/**
	 * Calculates the least square assuming all observations have the same weight as described in https://groups.google.com/forum/?fromgroups#!topic/mapinfo-l/au0j3pSLXHM Depends on sylvester for matrix calculation http://sylvester.jcoglan.com/
	 *
	 * @param {Array} Aarray Array of number arrays. Each row is [xSource, ySource, 1]
	 * @param {Array} Barray Array of number. Each row is [xDestination, yDestination, 1]
	 * @returns {Array} Array of number arrays. The matrix structure is [[a, b, c], [d, e, f], [u, v, w]] where each element is a parameter for equations aXsource + bYsource + c = xDestination and dXsource + eYsource + f = yDestination
	 */
	this.perspectivity = function(Aarray, Barray){
		//Inputs arrays to matrixes
		var A = Matrix.create(Aarray);
		var B = Matrix.create(Barray);
		
		var At  = A.transpose();
		
		//First part
		var AtA = At.multiply(A);
		var AtAinv = AtA.inverse();
		//Second part
		AtB = At.multiply(B);
	
		var resMatrix = AtAinv.multiply(AtB);
		resMatrix = resMatrix.transpose();
		var res = resMatrix.elements;
		return res;
	}

/*		
	this.polynomials = functions(){
		//at least 6 points
	}
*/
	
	
}