/*
Copyright © 2000 Alber Sanchez <albhasan@gmail.com>
This work is free. You can redistribute it and/or modify it under the
terms of the Do What The Fuck You Want To Public License, Version 2,
as published by Sam Hocevar. See the COPYING file for more details.
*/

function ControlPointManager(){
	var that = this;
	var prefix = "CP_";//Prefix used for naming control points
	var mapIndex = 0;//Helps building unique Ids for markers
	var imageIndex = 0;
	var mapArray = new Array();
	var imageArray = new Array(); 
	var notSet = "-";
	var zeroLeft = 3;

	
	//---------------------------------------------------------
	//PRIVATE
	//---------------------------------------------------------
	
	function cpId2Index(cpId){
		var res;
		var len = (mapArray.length >= imageArray.length) ? mapArray.length : imageArray.length;
		for(var i = 0; i < len; i++){
			if(i < mapArray.length){
				var cpMap = mapArray[i];
				if(cpId == cpMap[0] && cpMap[cpMap.length - 1] == true){
					res = i;
					break;
				}
			}
			if(i < imageArray.length){
				var cpImage = imageArray[i];
				if(cpId == cpImage[0] && cpImage[cpImage.length - 1] == true){
					res = i;
					break;
				}
			}
		}
		return res;
	}
	
	
	function createMapCp(x, y){
		var res = new Array();
		mapIndex++;
		res[0] = prefix + padNumber(mapIndex,zeroLeft);
		res[1] = x;
		res[2] = y;
		res[3] = true;
		mapArray.push(res);
		return res[0];
	}
	
	function createImageCp(x, y){
		var res = new Array();
		imageIndex++;
		res[0] = prefix + padNumber(imageIndex,zeroLeft);
		res[1] = x;
		res[2] = y;
		res[3] = true;
		imageArray.push(res);
		return res[0];
	}
	
	function readMapCp(cpId){
		var res;
		var index = cpId2Index(cpId);
		if(index >= 0 && index < mapArray.length){
			res = new Array();
			res = mapArray[index];
			res = splice(res.length - 1, 1);
		}
		return res;
	}
	
	function readImageCp(cpId){
		var res;
		var index = cpId2Index(cpId);
		if(index >= 0 && index < imageArray.length){
			res = new Array();
			res = imageArray[index];
			res = splice(res.length - 1, 1);
		}
		return res;
	}

	function updateMapCp(cpId, x, y){
		var res = false;
		var index = cpId2Index(cpId);
		if(index >= 0 && index < mapArray.length){
			var tmp = mapArray[index];
			tmp[1] = x;
			tmp[2] = y;
			tmp[3] = true;
			mapArray[index] = tmp;
			res = true;
		}
		return res;
	}
	
	function updateImageCp(cpId, x, y){
		var res = false;
		var index = cpId2Index(cpId);
		if(index >= 0 && index < imageArray.length){
			var tmp = imageArray[index];
			tmp[1] = x;
			tmp[2] = y;
			imageArray[index] = tmp;
			res = true;
		}
		return res;
	}
	
	//Mark as deleted
	function deleteMapCp(cpId){
		var res = false;
		var index = cpId2Index(cpId);
		if(index >= 0 && index < mapArray.length){
			var tmp = mapArray[index];
			tmp[tmp.length - 1] = false;
			mapArray[index] = tmp;
		}
		return res;
	}
	
	//Mark as deleted
	function deleteImageCp(cpId){
		var res = false;
		var index = cpId2Index(cpId);
		if(index >= 0 && index < imageArray.length){
			var tmp = imageArray[index];
			tmp[tmp.length - 1] = false;
			imageArray[index] = tmp;
		}
		return res;
	}
	
	//Mark all as deleted
	function deleteAll(){
		var len = (mapIndex >= imageIndex) ? mapIndex : imageIndex;	
		for (var i = 0; i < len; i++){
			if(i < imageArray.length){
				var tmp = imageArray[i];
				tmp[tmp.length - 1] = false;
				imageArray[i] = tmp;
			}
			if(i < mapArray.length){
				var tmp = mapArray[i];
				tmp[tmp.length - 1] = false;
				mapArray[i] = tmp;
			}
		}
	}
	
	//
	function clear(){
		mapIndex = 0;
		imageIndex = 0;
		mapArray = new Array();
		imageArray = new Array(); 
	}
	
	//---------------------------------------------------------
	//PRIVILEGED
	//---------------------------------------------------------
	this.addMapControlPoint = function(xImg, yImg){
		var res = createMapCp(xImg, yImg);
		return res;
	}

	this.addImageControlPoint = function(xImg, yImg){
		var res = createImageCp(xImg, yImg);
		return res;
	}

	this.removeControlPoint = function(cpId){
		deleteImageCp(cpId);
		deleteMapCp(cpId);
	}
	
	this.toArray = function(){
		var res = new Array();
		var len = (mapIndex >= imageIndex) ? mapIndex : imageIndex;		

		for (var i = 0; i < len; i++){
			var tmp = new Array();
			if(i < imageArray.length){
				var tmptmp = imageArray[i];
				if(tmptmp[tmptmp.length - 1]){
					tmp[0] = tmptmp[0];
					tmp[1] = tmptmp[1];
					tmp[2] = tmptmp[2];
				}else{
					tmp[1] = notSet;
					tmp[2] = notSet;
			}
			}else{
				tmp[1] = notSet;
				tmp[2] = notSet;
			}
			if(i < mapArray.length){
				var tmptmp = mapArray[i];
				if(tmptmp[tmptmp.length - 1]){
					tmp[0] = tmptmp[0];
					tmp[3] = tmptmp[1];
					tmp[4] = tmptmp[2];
				}else{
					tmp[3] = notSet;
					tmp[4] = notSet;
			}
			}else{
				tmp[3] = notSet;
				tmp[4] = notSet;
			}
			res.push(tmp);
		}
		return(res);
	}
	
	this.removeAll = function(){
		deleteAll();
	}
}