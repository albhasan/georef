/*
Copyright © 2000 Alber Sanchez <albhasan@gmail.com>
This work is free. You can redistribute it and/or modify it under the
terms of the Do What The Fuck You Want To Public License, Version 2,
as published by Sam Hocevar. See the COPYING file for more details.
*/


var map;//Map container
var mapImage;//Map container for the image
var imageMapMaxSize = 10;//Maximum size of the image in map units
var imgModelOriginal;//Representation of the image
var imgModelScaled;//Scaled representation of the image to fit the map container
var cpManager = new ControlPointManager();
var mkManager;
var imageMapLayer;
var cpTable;//Table of control points. It must be outside of the ready function
var imageBoundaryOnMap;
var imageMapAreaOnMap;
var drawnItemsImage = new L.FeatureGroup();
var drawnItemsMap = new L.FeatureGroup();



$(document).ready(function () {
	
	//------------------------------------------
	// Initialization
	//------------------------------------------
	initmap();
	
	$('#controlPointsTableDiv').html( '<table cellpadding="0" cellspacing="0" border="0" class="display" id="controlPointsTable"></table>' );
	cpTable = $('#controlPointsTable').dataTable( {
		"aaData": null,
		"aoColumns": [
			{ "sTitle": "CP Id", "sClass": "center" },
			{ "sTitle": "Im X", "sClass": "center" },
			{ "sTitle": "Im Y", "sClass": "center" },
			{ "sTitle": "Map X", "sClass": "center" },
			{ "sTitle": "Map Y", "sClass": "center" }
		]
	} ); 

	
	//------------------------------------------
	//LEAFLET http://leafletjs.com/
	//------------------------------------------
	function initmap(){

		//NOTES:
		//- The origin of the image in the map is 0,0
		
		//Map start
		map = L.map('map').setView([51.96236,7.62571], 12);//Default CRS is EPSG3857 spherical mercator
		mapImage = L.map('mapImage', {center: [imageMapMaxSize/2, imageMapMaxSize/2],zoom: 12,crs: L.CRS.Simple});	//Plane SRS to put the map-image
		mkManager = new MarkerManager(cpManager, drawnItemsImage, drawnItemsMap);
		
		//Adds layers
		L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
			maxZoom: 18,
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
		}).addTo(map);
		
		//Leaflet draw options
		mapImage.addLayer(drawnItemsImage);
		map.addLayer(drawnItemsMap);
		var drawControlImage = new L.Control.Draw({
			draw: {
				polyline: {
					title: 'Draw an 1 cm line',
					allowIntersection: false, // Restricts shapes to simple polygons
					drawError: {
						color: '#FF0000', // Color the shape will turn when intersects
						message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
					},
					shapeOptions: {
						color: '#00FF00'
					}
				},
				polygon: {
					title: 'Draw a Map Area on Image',
					allowIntersection: false,
					drawError: {
						color: '#FF0000', // Color the shape will turn when intersects
						message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
					},
					shapeOptions: {
						color: '#0000FF'
					}
				},
				circle: false,
				rectangle: false,
				marker: {
					title: 'Add an Image Control Point'
				}
			},
			edit: {
				featureGroup: drawnItemsImage
			}
		});
		var drawControlMap = new L.Control.Draw({
			draw: {
				polyline: false,
				polygon: false,
				circle: false,
				rectangle: false,
				marker: {
					title: 'Add a Map Control Point'
				}
			},
			edit: {
				featureGroup: drawnItemsMap
			}
		});
		mapImage.addControl(drawControlImage);
		map.addControl(drawControlMap);
		
		mapImage.on('draw:created', function(e) {
			var type = e.layerType;
			var layer = e.layer;
			if(imageMapLayer != null){
				if (type === 'marker') {
					var ll = layer.getLatLng();
					if(imgModelScaled.getScaledImage().isInside_Image1q(ll.lng, ll.lat)){
						//Transform to image coords
						var xyImgScl1Q = [ll.lng, ll.lat];
						var xyImgScl = imgModelScaled.getScaledImage().image1q2image(xyImgScl1Q[0], xyImgScl1Q[1]);
						var xyImgOriginal = imgModelScaled.unScaleCoords(xyImgScl[0], xyImgScl[1]);
						var cpId = mkManager.addImageMarkerImgScaled1Q(layer, imgModelScaled);
						updateImageControlPointInTable(cpTable, cpId, xyImgOriginal[0], xyImgOriginal[1]);
						projectImageBoundaries(cpManager, imgModelScaled, mkManager.getMapAreaCoords(), map);
					}
				}
				if(type === 'polygon'){
					mkManager.addMapArea(layer);
					projectImageBoundaries(cpManager, imgModelScaled, mkManager.getMapAreaCoords(), map);
				}
				if(type === 'polyline'){
					mkManager.addRuler(layer);
				}
			}
		});	

		map.on('draw:created', function(e) {
			var type = e.layerType;
			var layer = e.layer;
			if (type === 'marker') {
				var ll = layer.getLatLng();
				var cpId = mkManager.addMapMarker(layer);
				updateMapControlPointInTable(cpTable, cpId, ll.lng, ll.lat);
				projectImageBoundaries(cpManager, imgModelScaled, mkManager.getMapAreaCoords(), map);	
			}
		});

		mapImage.on('draw:deleted', function(e) {
			var layers = e.layers.getLayers();
			for(var i = 0; i < layers.length; i++){
				var layer = layers[i];
				if(layer instanceof L.Marker){
					cpid = layer._popup._content;
					mkManager.removeImageMarker(cpid);
					updateImageControlPointInTable(cpTable, cpid, "-", "-");
					projectImageBoundaries(cpManager, imgModelScaled, mkManager.getMapAreaCoords(), map);
				}else if(layer instanceof L.Polygon){
					projectImageBoundaries(cpManager, imgModelScaled, mkManager.getMapAreaCoords(), map);
				}
			}
		});
//TODO:caargar geonames ?
//TODO:cargar wikipedia ?
		map.on('draw:deleted', function(e) {
			var layers = e.layers.getLayers();
			for(var i = 0; i < layers.length; i++){
				var layer = layers[i];
				if(layer instanceof L.Marker){
					cpid = layer._popup._content;
					mkManager.removeMapMarker(cpid);
					updateMapControlPointInTable(cpTable, cpid, "-", "-");
					projectImageBoundaries(cpManager, imgModelScaled, mkManager.getMapAreaCoords(), map);
				}
			}
		});

//TODO: update event

		
		
	
	}

	
	function createTransformation(cpManager){
		var res;
		var matchCp = cpManager.getMatchedCP();
		var n = matchCp[0].length;
		if(n > 2){
			if(n == 2){
				res = new SimilarityTransformation(matchCp[1], matchCp[2]);
			}else if(n > 2){ //&& n < 6){
				res = new AffineTransformation(matchCp[1], matchCp[2]);
			//}else if(n > 5){
				//TODO: Create polynomial trasformation
			}
		}
		return res;
	}
	
	
	
	
	function latlon2xyArray(latlonArray){
		var res = new Array();
		for(var i = 0; i < latlonArray.length; i++){
			var ll = latlonArray[i];
			var tmpCoords = new Array();
			tmpCoords.push(ll.lng);
			tmpCoords.push(ll.lat);
			res.push(tmpCoords);
		}
		return res;
	}
	
	
	function projectImageBoundaries(cpManager, imgModelScaled, mapAreaLatLonArray, map){
		var trans = createTransformation(cpManager);
		if(trans != null){
			var imgBnd = new Array();
			var mapAreaBnd = new Array();
			
			imgBnd.push(imgModelScaled.getImageModel().getCartesianLowerLeft_Image1Q());
			imgBnd.push(imgModelScaled.getImageModel().getCartesianUpperLeft_Image1Q());
			imgBnd.push(imgModelScaled.getImageModel().getCartesianUpperRight_Image1Q());
			imgBnd.push(imgModelScaled.getImageModel().getCartesianLowerRight_Image1Q());
			
			var xyProjArrayBnd = trans.transform(imgBnd);

			if(imageBoundaryOnMap != null){
				map.removeLayer(imageBoundaryOnMap);
			}
			if(imageMapAreaOnMap != null){
				map.removeLayer(imageMapAreaOnMap);
			}
			
			//Draws the image boundaries
			imageBoundaryOnMap = L.polygon(xySwap(xyProjArrayBnd), {
				"stroke" : false, 
				"fill" : true, 
				"fillColor" : "#03f",
				"fillOpacity" : 0.2,
				"clickable" : false
			}).addTo(map);

			//Draws the map area
			if(mapAreaLatLonArray != null){
				//Gets an XY number array from L.Latlng objects
				mapAreaBnd = latlon2xyArray(mapAreaLatLonArray);
				//Scale the coords from scaled image to image
				var unScaledMapAreaBnd = imgModelScaled.unScaleCoordsArray(mapAreaBnd);
				//Transform the coords from image refsys to map refsys
				var xyProjmapAreaBnd = trans.transform(unScaledMapAreaBnd);				
				imageMapAreaOnMap = L.polygon(xySwap(xyProjmapAreaBnd), {
							"stroke" : true, 
							"fill" : false, 
							"fillColor" : "#03f",
							"fillOpacity" : 0.2,
							"clickable" : false
				}).addTo(map);
			}
		}else{
			if(imageBoundaryOnMap != null){
				map.removeLayer(imageBoundaryOnMap);
			}
			if(imageMapAreaOnMap != null){
				map.removeLayer(imageMapAreaOnMap);
			}
		}
	}
	
	//------------------------------------------
	//DataTables http://www.datatables.net
	//------------------------------------------

	function updateMapControlPointInTable(cpTable, cpId, xMap, yMap){
		if(cpId != null && cpTable != null){
			var rowIndex = getRowIndexFromTable(cpTable, cpId);
			if(rowIndex != null){
				cpTable.fnUpdate(xMap, rowIndex, 3);
				cpTable.fnUpdate(yMap, rowIndex, 4);
			}else{
				var tmp = [cpId, "-", "-", xMap, yMap];
				cpTable.fnAddData(tmp);
			}
		}
	}
	function updateImageControlPointInTable(cpTable, cpId, xImg, yImg){
		if(cpId != null && cpTable != null){
			var rowIndex = getRowIndexFromTable(cpTable, cpId);
			if(rowIndex != null){
				cpTable.fnUpdate(xImg, rowIndex, 1);
				cpTable.fnUpdate(yImg, rowIndex, 2);
			}else{
				var tmp = [cpId, xImg, yImg, "-", "-"];
				cpTable.fnAddData(tmp);
			}
		}
	}

	//Returns the index and the row values of the table 
	function getRowFromTable(cpTable, cpId, xImg, yImg){
		var res = new Array();
		var data = cpTable.fnGetData();
		var tmp = new Array();
		for(var i = 0; i < data.length; i++){
			tmp = data[i];
			var id = tmp[0];
			if(id == cpId){
				res.push(i);
				res.push(tmp);
				return res;
			}
		}
	}
	
	//returns the index of the row in the table (aoData array index)
	function getRowIndexFromTable(cpTable, cpId){
		var res;
		var data = cpTable.fnGetData();
		for(var i = 0; i < data.length; i++){
			var tmp = data[i];
			var id = tmp[0];
			if(id == cpId){
				res = i;
				break;
			}
		}
		return res;
	}
	
	
    //Add a click handler to the rows - this could be used as a callback 
    $("#controlPointsTableDiv").on('click', '#controlPointsTable tbody tr', function( e ) {
        if ( $(this).hasClass('row_selected') ) {
            $(this).removeClass('row_selected');
			mkManager.selectMarker("");
        }else {
            cpTable.$('tr.row_selected').removeClass('row_selected');
            $(this).addClass('row_selected');
			var cpId = cpTable.$('tr.row_selected')[0].children[0].innerHTML;
			mkManager.selectMarker(cpId);
        }
    });

//Add a click handler for the delete row 
/*
COntrol point deletion is taken care by leaflet draw in each map independently
$('#delete').click( function() {
	var anSelected = fnGetSelected( cpTable );
	if(anSelected.length !== 0){
		var selRow = cpTable.fnDeleteRow(anSelected[0]);
		var cpId = selRow[0]._aData[0]
		mkManager.removeMarker(cpId);
projectImageBoundaries(cpManager, imgModelOriginal, imgModelScaled, L, map);
	}
} );
*/

	//------------------------------------------
	//jQuery UI http://jqueryui.com/
	//------------------------------------------

	//Accordion
	$(function() {
		$( "#accordion" ).accordion({
		heightStyle: "fill"
		});
	});
	$(function() {
		$( "#accordion-resizer" ).resizable({
		minHeight: 140,
		minWidth: 200,
		resize: function() {
		$( "#accordion" ).accordion( "refresh" );
		}
		});
	});

	//Tabs
	$(function(){
		$( "#tabs" ).tabs();
		// fix the classes
		$( ".tabs-bottom .ui-tabs-nav, .tabs-bottom .ui-tabs-nav > *" )
		.removeClass( "ui-corner-all ui-corner-top" )
		.addClass( "ui-corner-bottom" );
		// move the nav to the bottom
		$( ".tabs-bottom .ui-tabs-nav" ).appendTo( ".tabs-bottom" );
	});


	//Button - load image
	$(function(){
		$( "#btLoadImage" ).click(function(){
			var imageUrl = $( "#imgMapInput" ).val();
			if(isUrlOfImage(imageUrl)){
				var image = new Image();
				image.onload = function(){
					//Loads the new image to the map
					imgModelOriginal = new ImageModel(imageUrl, this.width, this.height);
					imgModelScaled = new ScaledImage(imgModelOriginal, imageMapMaxSize);
					var scaleBounds = new Array();
					scaleBounds[0] = imgModelScaled.getScaledImage().getCartesianLowerLeft_Image1Q().reverse();
					scaleBounds[1] = imgModelScaled.getScaledImage().getCartesianUpperRight_Image1Q().reverse();
					if(imageMapLayer != null){
						mapImage.removeLayer(imageMapLayer);//Removes the last loaded image
					}
					imageMapLayer = new L.imageOverlay(imageUrl, scaleBounds);
					imageMapLayer.addTo(mapImage);
					mapImage.setView([imgModelScaled.getScaledImage().getHeight()/2, imgModelScaled.getScaledImage().getWidth()/2], 5);//Zoom to image center
//TODO: remove all control points when a new image is loaded
//removeAllControlPoints();
				}
				image.src = imageUrl;	
			}else{
				alert("Invalid URL!");
			}
		});
	});

	
});	

//Returns the selected row. It must be outside of the ready function
function fnGetSelected( oTableLocal ){
    return oTableLocal.$('tr.row_selected');
}