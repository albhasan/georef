/*
Copyright © 2000 Alber Sanchez <albhasan@gmail.com>
This work is free. You can redistribute it and/or modify it under the
terms of the Do What The Fuck You Want To Public License, Version 2,
as published by Sam Hocevar. See the COPYING file for more details.
*/


/**
 * Represents an image of a historic map
 *
 */
function ImageModel(imageUrl, width, height){

	var that = this;
	var url = imageUrl;
	var imageWidth = width;
	var imageHeight = height;
	var imageOrigin = [0,0];//Origin of coordinates of the image
	var c = new Coords();
	
	//---------------------------------------------------------
	//PRIVATE
	//---------------------------------------------------------

	/**
	 * Test if the given point is inside the image boundaries. It uses image's coordinate system
	 * @param xImg X coordinate in image coordinate system
	 * @param yImg Y coordinate in image coordinate system
	 * @returns TRUE if the point fall inside the image, FALSE otherwise
	 */
	function isInImage(xImg, yImg){
		res = true;
		if(xImg < imageOrigin[0] ||  yImg < imageOrigin[1] || xImg > imageWidth || yImg > imageHeight){
			res = false;
		}
		return res;
	}	
	
	
	//---------------------------------------------------------
	//PRIVILEGED
	//---------------------------------------------------------
	this.getUrl = function(){
		return url;
	}
	this.getWidth = function(){
		return imageWidth;
	}
	this.getHeight = function(){
		return imageHeight;
	}

	
	/**
	 * Returns the minimum coordinates of the image using image's coordinate system
	 * @returns An single array containing the x and y 
	 */
	this.getMinCoords = function(){
		return imageOrigin;
	}
	
	/**
	 * Returns the maximum coordinates of the image using image's coordinate system
	 * @returns An single array containing the x and y 
	 */
	this.getMaxCoords = function(){
		res = new Array();
		res[0] = this.getWidth();
		res[1] = this.getHeight();
		return res;
	}
	
	/**
	 * Returns the lower left coordinates of the image using image's coordinate system
	 * @returns An single array containing the x and y 
	 */
	this.getLowerLeft = function(){
		res = new Array();
		res[0] = this.getMinCoords()[0];
		res[1] = this.getHeight();
		return res;
	}

	/**
	 * Returns the upper left coordinates of the image using image's coordinate system
	 * @returns An single array containing the x and y 
	 */
	this.getUpperLeft = function(){
		var res = new Array();
		var minCoords = this.getMinCoords();
		res[0] = minCoords[0];
		res[1] = minCoords[1];
		return res;
	}

	/**
	 * Returns the upper right coordinates of the image using image's coordinate system
	 * @returns An single array containing the x and y 
	 */
	this.getUpperRight = function(){
		res = new Array();
		res[0] = this.getWidth();
		res[1] = this.getMinCoords()[1];
		return res;
	}

	/**
	 * Returns the lower right coordinates of the image using image's coordinate system
	 * @returns An single array containing the x and y 
	 */
	this.getLowerRight = function(){
		res = new Array();
		res[0] = this.getWidth();
		res[1] = this.getHeight();
		return res;
	}
	
	/**
	 * Transforms image to cartesian coordinates assuming the image is in the 4th Quadrant
	 * @param xImg X coordinate in image coordinate system
	 * @param yImg Y coordinate in image coordinate system
	 * @returns An single array containing the x and y transformed coordinates
	 */
	this.image2image4q = function(xImg, yImg){
		return c.image2cartesianCoords(xImg, yImg);
	}
	
	/**
	 * Transforms image to cartesian coordinates assuming the image is in the 1th Quadrant
	 * @param xImg X coordinate in image coordinate system
	 * @param yImg Y coordinate in image coordinate system
	 * @returns An single array containing the x and y transformed coordinates
	 */
	this.image2image1q = function(xImg, yImg){
		var i4q = this.image2image4q(xImg, yImg);
		return c.traslation(i4q[0], i4q[1], 0, imageHeight);
	}
	
	
	/**
	 * Transforms cartesian to image coordinates assuming the image is in the 4th Quadrant
	 * @param xImg4q X coordinate in image coordinate system (4th quadrant)
	 * @param yImg4q Y coordinate in image coordinate system (4th quadrant)
	 * @returns An single array containing the x and y transformed coordinates
	 */
	this.image4q2image = function(xImg4q, yImg4q){
		return c.cartesian2imageCoords(xImg4q, yImg4q);
	}
	
	/**
	 * Transforms cartesian to image coordinates assuming the image is in the 1th Quadrant
	 * @param xImg1q X coordinate in image coordinate system (1st quadrant)
	 * @param yImg1q Y coordinate in image coordinate system (1st quadrant)
	 * @returns An single array containing the x and y transformed coordinates
	 */
	this.image1q2image = function(xImg1q, yImg1q){
		var tras = c.traslation(xImg1q, yImg1q, 0, -imageHeight);
		return c.cartesian2imageCoords(tras[0], tras[1]);
	}
	
	
	/**
	 * Returns image's lower left coordinates assuming the image is in the 4th quadrant
	 * @returns An single array containing the x and y coordinates
	 */
	this.getCartesianLowerLeft_Image4Q = function(){
		var imgCoords = this.getLowerLeft();
		return this.image2image4q(imgCoords[0], imgCoords[1]);
	}
	
	/**
	 * Returns image's upper left coordinates assuming the image is in the 4th quadrant
	 * @returns An single array containing the x and y coordinates
	 */
	this.getCartesianUpperLeft_Image4Q = function(){
		var imgCoords = this.getUpperLeft();
		return this.image2image4q(imgCoords[0], imgCoords[1]);
	}
	
	/**
	 * Returns image's upper right coordinates assuming the image is in the 4th quadrant
	 * @returns An single array containing the x and y coordinates
	 */
	this.getCartesianUpperRight_Image4Q = function(){
		var imgCoords = this.getUpperRight();
		return this.image2image4q(imgCoords[0], imgCoords[1]);
	}
	
	/**
	 * Returns image's lower right coordinates assuming the image is in the 4th quadrant
	 * @returns An single array containing the x and y coordinates
	 */
	this.getCartesianLowerRight_Image4Q = function(){
		var imgCoords = this.getLowerRight();
		return this.image2image4q(imgCoords[0], imgCoords[1]);
	}
	

	/**
	 * Returns image's lower left coordinates assuming the image is in the 1st quadrant
	 * @returns An single array containing the x and y coordinates
	 */
	this.getCartesianLowerLeft_Image1Q = function(){
		var img = this.getLowerLeft();
		return this.image2image1q(img[0], img[1]);
	}

	/**
	 * Returns image's upper left coordinates assuming the image is in the 1st quadrant
	 * @returns An single array containing the x and y coordinates
	 */
	this.getCartesianUpperLeft_Image1Q = function(){
		var img = this.getUpperLeft();
		return this.image2image1q(img[0], img[1]);
	}

	/**
	 * Returns image's upper right coordinates assuming the image is in the 1st quadrant
	 * @returns An single array containing the x and y coordinates
	 */
	this.getCartesianUpperRight_Image1Q = function(){
		var img = this.getUpperRight();
		return this.image2image1q(img[0], img[1]);
	}
	
	/**
	 * Returns image's lower right coordinates assuming the image is in the 1st quadrant
	 * @returns An single array containing the x and y coordinates
	 */
	this.getCartesianLowerRight_Image1Q = function(){
		var img = this.getLowerRight();
		return this.image2image1q(img[0], img[1]);
	}
	
	/**
	 * Checks of the point is inside the image area using image's coordinate system
	 * @param xImg X coordinate in image coordinate system
	 * @param yImg Y coordinate in image coordinate system
	 * @returns TRUE if the point is inside the image, FALSE otherwise
	 */
	this.isInsideImage = function(xImg, yImg){
		return isInImage(xImg, yImg);
	}
	
	/**
	 * Assuming the image is in the 4th quadrant, checks of the point is inside the image area
	 * @param xImg4q X coordinate in image coordinate system
	 * @param yImg4q Y coordinate in image coordinate system
	 * @returns TRUE if the point is inside the image, FALSE otherwise
	 */
	this.isInside_Image4q = function(xImg4q, yImg4q){
		var img = this.image4q2image(xImg4q, yImg4q);
		return this.isInsideImage(img[0], img[1]);
	}
	
	/**
	 * Assuming the image is in the 1st quadrant, checks of the point is inside the image area
	 * @param xImg1q X coordinate in image coordinate system
	 * @param yImg1q Y coordinate in image coordinate system
	 * @returns TRUE if the point is inside the image, FALSE otherwise
	 */
	this.isInside_Image1q = function(xImg1q, yImg1q){
		var img = this.image1q2image(xImg1q, yImg1q);
		return this.isInsideImage(img[0], img[1]);
	}
	
}