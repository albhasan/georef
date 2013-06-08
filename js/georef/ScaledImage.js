/*
Copyright © 2000 Alber Sanchez <albhasan@gmail.com>
This work is free. You can redistribute it and/or modify it under the
terms of the Do What The Fuck You Want To Public License, Version 2,
as published by Sam Hocevar. See the COPYING file for more details.
*/

function ScaledImage(imgModel, maxSize){
	var imageModel = imgModel;
	var maximumSize = maxSize;
	var scaledImage = scaleImageToSize(imageModel.getWidth(), imageModel.getHeight(), maximumSize);
	
	//---------------------------------------------------------
	//PRIVATE
	//---------------------------------------------------------
	//Calculates the scaled image proportions to fit the given size
	function scaleImageToSize(imgOriginalWidth, imgOriginalHeight, maxSize){
		var xProp = maxSize;
		var yProp = maxSize;
		if(imgOriginalWidth > imgOriginalHeight){
			yProp = imgOriginalHeight * xProp / imgOriginalWidth;
		}else if(imgOriginalWidth < imgOriginalHeight){
			xProp = imgOriginalWidth * yProp / imgOriginalHeight;
		}
		var res = new ImageModel("", xProp, yProp);//Cuidado, quiza no se pueda llamar a la clase desde un metodo privado
		return res;
	}

	//---------------------------------------------------------
	//PRIVILEGED
	//---------------------------------------------------------
	this.getImageModel = function(){
		return imageModel;
	}
	
	this.getScaledImage = function(){
		return scaledImage;
	}
	
	this.getMaximumSize = function(){
		return maximumSize;
	}
	
	this.scaleCoords = function(xImgOriginal, yImgOriginal){
		var res = new Array();
		var xScaled = xImgOriginal * scaledImage.getWidth() / imageModel.getWidth();
		var yScaled = yImgOriginal * scaledImage.getHeight() / imageModel.getHeight();
		res.push(xScaled);
		res.push(yScaled);
		return res;
	}

	this.unScaleCoords = function(xImgScaled, yImgScaled){
		var res = new Array();
		var xOriginal = xImgScaled * imageModel.getWidth() / scaledImage.getWidth();
		var yOriginal = yImgScaled * imageModel.getHeight() / scaledImage.getHeight();
		res.push(xOriginal);
		res.push(yOriginal);
		return res;
	}
	
	this.scaleCoordsArray = function(xyImgOriginal){
		var res = new Array();
		for(var i = 0; i < xyImgOriginal.length; i++){
			var tmpArray = xyImgOriginal[i];
			var tmpRes = this.scaleCoords(tmpArray[0], tmpArray[1]);
			res.push(tmpRes);
		}
		return res;
	}

	this.unScaleCoordsArray = function(xyImgOriginal){
		var res = new Array();
		for(var i = 0; i < xyImgOriginal.length; i++){
			var tmpArray = xyImgOriginal[i];
			var tmpRes = this.unScaleCoords(tmpArray[0], tmpArray[1]);
			res.push(tmpRes);
		}
		return res;
	}

}