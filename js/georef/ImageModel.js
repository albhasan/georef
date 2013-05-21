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

	//Using image's refsys
	function isInImage(xImg, yImg){
		res = true;
		if(xImg < imageOrigin[0] ||  yImg < imageOrigin[1] || xImg > imageWidth || yImg > imageHeight){
			res = false;
		}
		return res;
	}	
	
	//Calculates the scaled image proportions to fit the given size
	function scaleImageToSize(imgWidth, imgHeight, maxSize){
		var xProp = maxSize;
		var yProp = maxSize;
		if(imgWidth > imgHeight){
			yProp = imgHeight * xProp / imgWidth;
		}else if(imgWidth < imgHeight){
			xProp = imgWidth * yProp / imgHeight;
		}
		var res = new Array(xProp, yProp);
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
	this.getScaledImageModel = function(maximumSize){
		var prop = scaleImageToSize(this.getWidth(), this.getHeight(), maximumSize);
		var res = new ImageModel("", prop[0], prop[1]);
		return res;
	}
	//Using image's ref sys
	this.getMinCoords = function(){
		return imageOrigin;
	}
	//Using image's ref sys
	this.getMaxCoords = function(){
		res = new Array();
		res[0] = this.getWidth();
		res[1] = this.getHeight();
		return res;
	}
	//Using image's ref sys
	this.getLowerLeft = function(){
		res = new Array();
		res[0] = this.getMinCoords()[0];
		res[1] = this.getHeight();
		return res;
	}
	//Using image's ref sys
	this.getUpperRight = function(){
		res = new Array();
		res[0] = this.getWidth();
		res[1] = this.getMinCoords()[1];
		return res;
	}
	
	//transforms image to cartesian coordinates assuming the image is in the 4th Quadrant
	this.image2image4q = function(xImg, yImg){
		return c.image2cartesianCoords(xImg, yImg);
	}
	//transforms image to cartesian coordinates assuming the image is in the 1th Quadrant
	this.image2image1q = function(xImg, yImg){
		var i4q = this.image2image4q(xImg, yImg);
		return c.traslation(i4q[0], i4q[1], 0, imageHeight);
	}
	//transforms cartesian to image coordinates assuming the image is in the 4th Quadrant
	this.image4q2image = function(xImg4q, yImg4q){
		return c.cartesian2imageCoords(xImg4q, yImg4q);
	}
	
	
	//transforms cartesian to image coordinates assuming the image is in the 1th Quadrant
	this.image1q2image = function(xImg1q, yImg1q){
		var tras = c.traslation(xImg1q, yImg1q, 0, -imageHeight);
		return c.cartesian2imageCoords(tras[0], tras[1]);
	}
	
	
	
	//Assuming the image is in the 4th quadrant
	this.getCartesianLowerLeft_Image4Q = function(){
		var imgCoords = this.getLowerLeft();
		return this.image2image4q(imgCoords[0], imgCoords[1]);
	}
	//Assuming the image is in the 4th quadrant
	this.getCartesianUpperRight_Image4Q = function(){
		var imgCoords = this.getUpperRight();
		return this.image2image4q(imgCoords[0], imgCoords[1]);
	}
	//Assuming the image is in the 1st quadrant
	this.getCartesianLowerLeft_Image1Q = function(){
		var img = this.getLowerLeft();
		return this.image2image1q(img[0], img[1]);
	}
	//Assuming the image is in the 1st quadrant
	this.getCartesianUpperRight_Image1Q = function(){
		var img = this.getUpperRight();
		return this.image2image1q(img[0], img[1]);
	}


	//Using image's ref sys, checks of the point is inside the image area
	this.isInsideImage = function(xImg, yImg){
		return isInImage(xImg, yImg);
	}
	//Assuming the image is in the 4th quadrant, checks of the point is inside the image area
	this.isInside_Image4q = function(xImg4q, yImg4q){
		var img = this.image4q2image(xImg4q, yImg4q);
		return this.isInsideImage(img[0], img[1]);
	}
	//Assuming the image is in the 1st quadrant, checks of the point is inside the image area
	this.isInside_Image1q = function(xImg1q, yImg1q){
		var img = this.image1q2image(xImg1q, yImg1q);
		return this.isInsideImage(img[0], img[1]);
	}
	
}