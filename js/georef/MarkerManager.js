/*
Copyright © 2000 Alber Sanchez <albhasan@gmail.com>
This work is free. You can redistribute it and/or modify it under the
terms of the Do What The Fuck You Want To Public License, Version 2,
as published by Sam Hocevar. See the COPYING file for more details.
*/

function MarkerManager(cpMngr, imgMap, map){
	var that = this;
	var imageMap = imgMap;
	var mapMap = map;
	var mapMarkerArray = new Array();
	var imageMarkerArray = new Array();
	var cpManager = cpMngr;//Control point manager
	var selectedMarkerMap;
	var selectedMarkerImage;
	var controlPointIcon = L.icon({
		iconUrl: './js/Leaflet-Leaflet-0deed73/dist/images/marker-icon.png',
		shadowUrl: './js/Leaflet-Leaflet-0deed73/dist/images/marker-shadow.png',
		iconSize:     [25, 41], // size of the icon
		shadowSize:   [41, 41], // size of the shadow
		iconAnchor:   [12, 40], // point of the icon which will correspond to marker's location
		shadowAnchor: [12, 40],  // the same for the shadow
		popupAnchor:  [0, -40] // point from which the popup should open relative to the iconAnchor
	});	
	var selectedCpIcon = L.icon({
		iconUrl: './js/Leaflet-Leaflet-0deed73/dist/images/marker-icon@2x.png',
		shadowUrl: './js/Leaflet-Leaflet-0deed73/dist/images/marker-shadow.png',
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
				imageMap.removeLayer(tmp[1]);
				var res = imageMarkerArray.splice(i,1);
				break;
			}
		}
	}
	
	
	function deleteMapMarker(cpId){
		for(var i = 0; i < mapMarkerArray.length; i++){
			var tmp = mapMarkerArray[i];
			if(cpId == tmp[0]){
				mapMap.removeLayer(tmp[1]);
				var res = mapMarkerArray.splice(i,1);
				break;
			}
		}
	}
	
	//---------------------------------------------------------
	//PRIVILEGED
	//---------------------------------------------------------
	this.addMapMarker = function(aL, aLatlng){
		var id = cpManager.addMapControlPoint(aLatlng.lng, aLatlng.lat);
		var marker = aL.marker(aLatlng, {icon: controlPointIcon});
		var tmp = new Array();
		tmp.push(id);
		tmp.push(marker);
		mapMarkerArray.push(tmp);
		marker.addTo(mapMap);
		marker.bindPopup(id).openPopup();
		return id;
	}
	
	this.addImageMarker = function(aL, aLatlng){
		var id = cpManager.addImageControlPoint(aLatlng.lng, aLatlng.lat);
		var marker = aL.marker(aLatlng, {icon: controlPointIcon});
		var tmp = new Array();
		tmp.push(id);
		tmp.push(marker);
		imageMarkerArray.push(tmp);
		marker.addTo(imageMap);
		marker.bindPopup(id).openPopup();
		return id;
	}
	
	this.removeImageMarker = function(cpId){
		deleteImageMarker(cpId);
	}
	
	this.removeMapMarker = function(cpId){
		deleteMapMarker(cpId);
	}
	
	this.selectMarker = function(cpId){
		var mkImage = getImageMarker(cpId);
		var mkMap = getMapMarker(cpId);
		
		if(selectedMarkerImage != null){
			selectedMarkerImage.setIcon(controlPointIcon);
		}
		if(selectedMarkerMap != null){
			selectedMarkerMap.setIcon(controlPointIcon);
		}
		
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
	
}