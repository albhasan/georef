/*
Copyright © 2000 Alber Sanchez <albhasan@gmail.com>
This work is free. You can redistribute it and/or modify it under the
terms of the Do What The Fuck You Want To Public License, Version 2,
as published by Sam Hocevar. See the COPYING file for more details.
*/

function MarkerManager(cpMngr, dwItmImage, dwItmMap){
	var that = this;
	var mapMarkerArray = new Array();
	var imageMarkerArray = new Array();
	var cpManager = cpMngr;//Control point manager
	var selectedMarkerMap;
	var selectedMarkerImage;
	var drawnItemsImage = dwItmImage;
	var drawnItemsMap = dwItmMap;

	
	
	var controlPointIcon = L.icon({
		iconUrl: './js/Leaflet/dist/images/marker-icon.png',
		shadowUrl: './js/Leaflet/dist/images/marker-shadow.png',
		iconSize:     [25, 41], // size of the icon
		shadowSize:   [41, 41], // size of the shadow
		iconAnchor:   [12, 40], // point of the icon which will correspond to marker's location
		shadowAnchor: [12, 40],  // the same for the shadow
		popupAnchor:  [0, -40] // point from which the popup should open relative to the iconAnchor
	});	
	var selectedCpIcon = L.icon({
		iconUrl: './js/Leaflet/dist/images/marker-icon-2x.png',
		shadowUrl: './js/Leaflet/dist/images/marker-shadow.png',
		iconSize:     [50, 82], // size of the icon
		shadowSize:   [41, 41], // size of the shadow
		iconAnchor:   [25, 81], // point of the icon which will correspond to marker's location
		shadowAnchor: [12, 40],  // the same for the shadow
		popupAnchor:  [0, -82] // point from which the popup should open relative to the iconAnchor
	});	
	
	//---------------------------------------------------------
	//PRIVATE
	//---------------------------------------------------------
	function getImageMarker(cpId){
		var res;
		for(var i = 0; i < imageMarkerArray.length; i++){
			var tmp = imageMarkerArray[i];
			if(cpId == tmp[0]){
				res = tmp[1];
				break;
			}
		}
		return res;
	}
	
	function getMapMarker(cpId){
		var res;
		for(var i = 0; i < mapMarkerArray.length; i++){
			var tmp = mapMarkerArray[i];
			if(cpId == tmp[0]){
				res = tmp[1];
				break;
			}
		}
		return res;
	}
	
	function deleteImageMarker(cpId){
		for(var i = 0; i < imageMarkerArray.length; i++){
			var tmp = imageMarkerArray[i];
			if(cpId == tmp[0]){
				var res = imageMarkerArray.splice(i,1);
//drawnItemsImage
				break;
			}
		}
	}
	
	
	function deleteMapMarker(cpId){
		for(var i = 0; i < mapMarkerArray.length; i++){
			var tmp = mapMarkerArray[i];
			if(cpId == tmp[0]){
				var res = mapMarkerArray.splice(i,1);
//drawnItemsMap
				break;
			}
		}
	}
	
	//---------------------------------------------------------
	//PRIVILEGED
	//---------------------------------------------------------
	this.addMapMarker = function(layer){
		var id = cpManager.addMapControlPoint(layer.getLatLng().lng, layer.getLatLng().lat);
		var tmp = new Array();
		
		tmp.push(id);
		tmp.push(layer);
		mapMarkerArray.push(tmp);
		drawnItemsMap.addLayer(layer);
		layer.bindPopup(id).openPopup();

		return id;
	}
	
	this.addImageMarkerImgScaled1Q = function(layer, aScaledImage){
		var xyImgScl1Q = [layer.getLatLng().lng, layer.getLatLng().lat];
		var xyImgScl = aScaledImage.getScaledImage().image1q2image(xyImgScl1Q[0], xyImgScl1Q[1]);
		var xyImgOriginal = aScaledImage.unScaleCoords(xyImgScl[0], xyImgScl[1]);
		var xyImgOriginal1Q = aScaledImage.getImageModel().image2image1q(xyImgOriginal[0], xyImgOriginal[1]);
		var id = cpManager.addImageControlPoint(xyImgOriginal1Q[0], xyImgOriginal1Q[1]);
		var tmp = new Array();
		
		tmp.push(id);
		tmp.push(layer);
		imageMarkerArray.push(tmp);
		drawnItemsImage.addLayer(layer);
		layer.bindPopup(id).openPopup();
		
		return id;
	}
	
	this.removeMarker = function(cpId){
		deleteImageMarker(cpId);
		deleteMapMarker(cpId);
		cpManager.removeControlPoint(cpId);
	}

	this.removeMapMarker = function(cpId){
		deleteMapMarker(cpId);
		cpManager.removeMapControlPoint(cpId);
	}

	this.removeImageMarker = function(cpId){
		deleteMapMarker(cpId);
		cpManager.removeImageControlPoint(cpId);
	}

	
	this.selectMarker = function(cpId){
		var mkImage = getImageMarker(cpId);
		var mkMap = getMapMarker(cpId);
		
		//Changes the icons of the former selected markers
		if(selectedMarkerImage != null){
			selectedMarkerImage.setIcon(controlPointIcon);
		}
		if(selectedMarkerMap != null){
			selectedMarkerMap.setIcon(controlPointIcon);
		}
		//Changes the icons of the new selected markers
		if(mkImage != null){
			mkImage.setIcon(selectedCpIcon);
			selectedMarkerImage = mkImage;
		}else{
			selectedMarkerImage = null;
		}
		if(mkMap != null){
			mkMap.setIcon(selectedCpIcon);
			selectedMarkerMap = mkMap;
		}else{
			selectedMarkerMap = null;
		}
		
	}
	
	//Adds the map area polygon (drawn on the image)
	this.addMapArea = function(layer){
		drawnItemsImage.addLayer(layer);
	}
	
	//Adds the ruler distance (drawn on the image)
	this.addRuler = function(layer){
		drawnItemsImage.addLayer(layer);
	}
}