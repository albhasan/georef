/*
Copyright © 2000 Alber Sanchez <albhasan@gmail.com>
This work is free. You can redistribute it and/or modify it under the
terms of the Do What The Fuck You Want To Public License, Version 2,
as published by Sam Hocevar. See the COPYING file for more details.
*/

/**
 * Keeps the control points.
 * @constructor
 */
function ControlPointManager(){
	var that = this;
	var prefix = "CP_";//Prefix used for naming control points
	var mapIndex = 0;//Helps building unique Ids for markers
	var imageIndex = 0;
	var mapArray = new Array();//Internal array of map control points
	var imageArray = new Array(); //Internal array of image control points
	var notSet = "-";//Character used when there is no control point. 
	var zeroLeft = 3;

	//---------------------------------------------------------
	//PRIVATE
	//---------------------------------------------------------
	
	/**
	* Returns the array index for a control point
	* @param {string} cpId - Control point's identifier.
	* @returns Integer (when cpId is found) or null.
	*/
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
	
	/**
	* Creates a map control point.
	* @param {double} x - X coord.
	* @param {double} y - Y coord.
	* @returns The control point identifier (string)
	*/
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

	/**
	* Creates an image control point.
	* @param {double} x - X coord.
	* @param {double} y - Y coord.
	* @returns The control point identifier (string)
	*/
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
	
	/**
	* Returns a map control point.
	* @param {string} cpId - Control point's identifier.
	* @returns An array with the control point data [id, x, y]
	*/
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
	
	/**
	* Returns an image control point.
	* @param {string} cpId - Control point's identifier.
	* @returns An array with the control point data [id, x, y]
	*/
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

	/**
	* Updates a map control point's data.
	* @param {string} cpId - Control point's identifier.
	* @param {double} x - X coord.
	* @param {double} y - Y coord.
	* @returns True if success, false otherwise.
	*/
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
	
	/**
	* Updates an image control point's data.
	* @param {string} cpId - Control point's identifier.
	* @param {double} x - X coord.
	* @param {double} y - Y coord.
	* @returns True if success, false otherwise.
	*/
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
	
	/**
	* Marks a map control point as deleted
	* @param {string} cpId - Control point's identifier.
	* @returns True if success, false otherwise.
	*/
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
	
	/**
	* Marks an image control point as deleted
	* @param {string} cpId - Control point's identifier.
	* @returns True if success, false otherwise.
	*/
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
	
	/**
	* Marks all (map's and image's) control points as deleted.
	*/
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
	
	/**
	* Deletes all (map's and image's) control points.
	*/
	function clear(){
		mapIndex = 0;
		imageIndex = 0;
		mapArray = new Array();
		imageArray = new Array(); 
	}
	
	//---------------------------------------------------------
	//PRIVILEGED
	//---------------------------------------------------------
	
	/**
	* Adds a new map control point.
	* @param {double} x - X coord.
	* @param {double} y - Y coord.
	* @returns True if success, false otherwise.
	*/
	this.addMapControlPoint = function(x, y){
		var res = createMapCp(x, y);
		return res;
	}

	/**
	* Adds a new image control point.
	* @param {double} x - X coord.
	* @param {double} y - Y coord.
	* @returns True if success, false otherwise.
	*/
	this.addImageControlPoint = function(x, y){
		var res = createImageCp(x, y);
		return res;
	}

	/**
	* Removes a control point (map and image).
	* @param {string} cpId - Control point's identifier.
	*/
	this.removeControlPoint = function(cpId){
		deleteImageCp(cpId);
		deleteMapCp(cpId);
	}

	/**
	* Removes a map control point.
	* @param {string} cpId - Control point's identifier.
	*/
	this.removeMapControlPoint = function(cpId){
		deleteMapCp(cpId);
	}

	/**
	* Removes an image control point.
	* @param {string} cpId - Control point's identifier.
	*/
	this.removeImageControlPoint = function(cpId){
		deleteImageCp(cpId);
	}


	/**
	* Retrieves the control points (map and image) as an array.
	* @returns An array of arrays [cpId, xImg, yImg, xMap, yMap]
	*/	
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
	
	/**
	* Marks all the control points (map and image) as deleted.
	*/
	this.removeAll = function(){
		deleteAll();
	}
	
	/**
	* Retrieves the control points where there is data for both image and map.
	* @returns An array of 3 arrays: cpIds, xyImage [xImg, yImg] and xyMap [xMap, yMap].
	*/
	this.getMatchedCP = function(){
		var res = new Array();
		var cpIdArray = new Array();
		var xyFrom = new Array();
		var xyTo = new Array();
		
		var len = (mapIndex <= imageIndex) ? mapIndex : imageIndex;		
		for (var i = 0; i < len; i++){
			var cpMap = mapArray[i];
			var cpImg = imageArray[i];
			if(cpMap[cpMap.length - 1] && cpImg[cpImg.length - 1]){
				cpIdArray.push(cpImg[0]);
				var xyFromTmp = new Array();
				xyFromTmp.push(cpImg[1]);
				xyFromTmp.push(cpImg[2]);
				xyFrom.push(xyFromTmp)
				var xyToTmp = new Array();
				xyToTmp.push(cpMap[1]);
				xyToTmp.push(cpMap[2]);
				xyTo.push(xyToTmp);
			}
		}
		res.push(cpIdArray);
		res.push(xyFrom);
		res.push(xyTo);
		return res;
	}
}