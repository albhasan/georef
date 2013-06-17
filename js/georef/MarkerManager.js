/*
Copyright © 2000 Alber Sanchez <albhasan@gmail.com>
This work is free. You can redistribute it and/or modify it under the
terms of the Do What The Fuck You Want To Public License, Version 2,
as published by Sam Hocevar. See the COPYING file for more details.
*/

//Add dwItmImage and dwItmMap as a layer to the maps before creating this object
function MarkerManager(cpMngr, dwItmImage, dwItmMap){
	var that = this;
	var cpManager = cpMngr;//Control point manager
	var selectedMarkerMap;
	var selectedMarkerImage;
	var drawnItemsImage = dwItmImage;
	var drawnItemsMap = dwItmMap;

	
	
	var controlPointIcon = L.icon({
//TODO: Move to config	
		iconUrl: './js/Leaflet/dist/images/marker-icon.png',
		shadowUrl: './js/Leaflet/dist/images/marker-shadow.png',
		iconSize:     [25, 41], // size of the icon
		shadowSize:   [41, 41], // size of the shadow
		iconAnchor:   [12, 40], // point of the icon which will correspond to marker's location
		shadowAnchor: [12, 40],  // the same for the shadow
		popupAnchor:  [0, -40] // point from which the popup should open relative to the iconAnchor
	});	
	var selectedCpIcon = L.icon({
//TODO: Move to config
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


	function changeMarkerIcon(drawnItems, cpId, icon){
		drawnItems.eachLayer(function (layer) {
			if(layer instanceof L.Marker){
				var id = layer._popup._content;
				if(id == cpId){
					layer.setIcon(icon);
				}
			}
		});
	}

	function selectImageMarker(cpId, select){
		if(select){
			changeMarkerIcon(drawnItemsImage, cpId, selectedCpIcon);
		}else{
			changeMarkerIcon(drawnItemsImage, cpId, controlPointIcon);
		}
	}

	function selectMapMarker(cpId, select){
		if(select){
			changeMarkerIcon(drawnItemsMap, cpId, selectedCpIcon);
		}else{
			changeMarkerIcon(drawnItemsMap, cpId, controlPointIcon);
		}
	}


	//---------------------------------------------------------
	//PRIVILEGED
	//---------------------------------------------------------
	this.addMapMarker = function(layer){
		var id = cpManager.addMapControlPoint(layer.getLatLng().lng, layer.getLatLng().lat);

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

		drawnItemsImage.addLayer(layer);
		layer.bindPopup(id).openPopup();
		
		return id;
	}
	
	this.removeMarker = function(cpId){
		cpManager.removeControlPoint(cpId);
	}

	this.removeMapMarker = function(cpId){
		cpManager.removeMapControlPoint(cpId);
	}

	this.removeImageMarker = function(cpId){
		cpManager.removeImageControlPoint(cpId);
	}

	this.selectMarker = function(cpId){

		//Changes the icons of the former selected markers back to normal
		if(selectedMarkerImage != null){
			selectImageMarker(selectedMarkerImage, false);
			selectedMarkerImage = null;
		}
		if(selectedMarkerMap != null){
			selectMapMarker(selectedMarkerMap, false);
			selectedMarkerMap = null;
		}
	
		if(cpId.length > 0){
			//Changes the icons of the new selected markers
			selectImageMarker(cpId, true);
			selectMapMarker(cpId, true);
			selectedMarkerImage = cpId;
			selectedMarkerMap = cpId;
		}
	}
	
	//Adds the map area polygon (drawn on the image)
	this.addMapArea = function(newlayer){
		//Removes any previous layers
		drawnItemsImage.eachLayer(function (layer) {
			if(layer instanceof L.Polygon){
				drawnItemsImage.removeLayer(layer);
			}
		});	
		// add the new polygon
		if(newlayer instanceof L.Polygon){
			drawnItemsImage.addLayer(newlayer);
		}
	}
	
	//Adds the ruler distance (drawn on the image)
	this.addRuler = function(layer){
		//Removes any previous layers
		drawnItemsImage.eachLayer(function (layer) {
			if(layer instanceof L.Polyline){
				drawnItemsImage.removeLayer(layer);
			}
		});	
		// add the new polyline
		if(layer instanceof L.Polyline){
			drawnItemsImage.addLayer(layer);
		}
	}
	
	//returns a L.LatLng array
	this.getMapAreaCoords = function(){
		var res;
		var mapArea;
		var maArray = new Array();
		drawnItemsImage.eachLayer(function (layer) {
			if(layer instanceof L.Polygon){
				maArray.push(layer);
			}
		});	
		if(maArray.length > 0){
			mapArea = maArray[0];
		}else{
			return res;
		}
		res = mapArea.getLatLngs();
		return res;
	}
}