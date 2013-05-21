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
	function createMapCp(x, y){
		var res = new Array();
		mapIndex++;
		res[0] = prefix + padNumber(mapIndex,zeroLeft);
		res[1] = x;
		res[2] = y;
		res[3] = true;
		mapArray.push(res);
		return res;
	}
	
	function createImageCp(x, y){
		var res = new Array();
		imageIndex++;
		res[0] = prefix + padNumber(imageIndex,zeroLeft);
		res[1] = x;
		res[2] = y;
		res[3] = true;
		imageArray.push(res);
		return res;
	}
	
	function readMapCp(index){
		var res;
		if(index >= 0 && index < mapArray.length){
			res = new Array();
			res = mapArray[index];
			res = splice(res.length - 1, 1);
		}
		return res;
	}
	
	function readImageCp(index){
		var res;
		if(index >= 0 && index < imageArray.length){
			res = new Array();
			res = imageArray[index];
			res = splice(res.length - 1, 1);
		}
		return res;
	}

	function updateMapCp(index, x, y){
		var res = false;
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
	
	function updateImageCp(index, x, y){
		var res = false;
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
	function deleteMapCp(index){
		var res = false;
		if(index >= 0 && index < mapArray.length){
			var tmp = mapArray[index];
			tmp[tmp.length - 1] = false;
			mapArray[index] = tmp;
		}
		return res;
	}
	
	//Mark as deleted
	function deleteImageCp(index){
		var res = false;
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
	this.addMapMarker = function(aL, aLatlng, anIcon){
		var res = new Array();
		var marker = aL.marker(aLatlng, {icon: anIcon});
		var mcp = createMapCp(aLatlng.lng, aLatlng.lat);
		res[0] = mcp[0];
		res[1] = marker;
		return res;
	}

	this.addImageMarker = function(aL, aLatlng, anIcon){
		var res = new Array();
		var marker = aL.marker(aLatlng, {icon: anIcon});
		var icp = createImageCp(aLatlng.lng, aLatlng.lat);
		res[0] = icp[0];
		res[1] = marker;
		return res;
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