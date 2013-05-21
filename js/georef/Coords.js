/*
Copyright © 2000 Alber Sanchez <albhasan@gmail.com>
This work is free. You can redistribute it and/or modify it under the
terms of the Do What The Fuck You Want To Public License, Version 2,
as published by Sam Hocevar. See the COPYING file for more details.
*/

function Coords(){


	//---------------------------------------------------------
	//PRIVATE
	//---------------------------------------------------------

	
	//---------------------------------------------------------
	//PRIVILEGED
	//---------------------------------------------------------

	//Transformation from cartesian coordinates to image coordinates
	this.cartesian2imageCoords = function (x, y){
		var res = new Array();
		res[0] = x;
		res[1] = -y;
		return res;
	}

	//Transformation from image coordinates to cartesian coordinates
	this.image2cartesianCoords = function (xImg, yImg){
		var res = new Array();
		res[0] = xImg;
		res[1] = -yImg;
		return res;
	}
	
	//Traslation
	this.traslation = function(x, y, dx, dy){
		var res = new Array();
		res[0] = x + dx;
		res[1] = y + dy;
		return res;
	}

	
	//Uses sylvester
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
	
	//Uses sylvester
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
	
	
	//Uses sylvester
	//https://groups.google.com/forum/?fromgroups#!topic/mapinfo-l/au0j3pSLXHM
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
		var res = resMatrix.elements;
		
		return res;
	}

/*		
	this.polynomials = functions(){
		//at least 6 points
	}
*/
	
	
}