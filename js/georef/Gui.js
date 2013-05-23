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
		map = L.map('map').setView([51.96236,7.62571], 12);
		mapImage = L.map('mapImage', {center: [imageMapMaxSize/2, imageMapMaxSize/2],zoom: 12,crs: L.CRS.Simple});	//Plane SRS to put the map-image
		mkManager = new MarkerManager(cpManager, mapImage, map);		
		
		//Adds layers
		L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
			maxZoom: 18,
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
		}).addTo(map);
		//Event registration
		map.on('click', function(e) {
			//alert(e.latlng);
			var cpId = mkManager.addMapMarker(L, e.latlng);
			addControlPointToTable(cpTable, cpId, null, null, e.latlng.lng, e.latlng.lat);
projectImageBoundaries(cpManager, imgModelOriginal, imgModelScaled, L, map);					
		});
		mapImage.on('click', function(e) {
			//alert(e.latlng);
			if(imageMapLayer != null){
				if(imgModelScaled.getScaledImage().isInside_Image1q(e.latlng.lng, e.latlng.lat)){
					//Transform to image coords
					var xyImgScl1Q = [e.latlng.lng, e.latlng.lat];
					var xyImgScl = imgModelScaled.getScaledImage().image1q2image(xyImgScl1Q[0], xyImgScl1Q[1]);
					var xyImgOriginal = imgModelScaled.unScaleCoords(xyImgScl[0], xyImgScl[1]);
					var cpId = mkManager.addImageMarkerImgScaled1Q(L, e.latlng, imgModelScaled);
					addControlPointToTable(cpTable, cpId, xyImgOriginal[0], xyImgOriginal[1], null, null);
projectImageBoundaries(cpManager, imgModelOriginal, imgModelScaled, L, map);					
				}
			}
		});
	}

	function projectImageBoundaries(cpManager, imgModelOriginal, imgModelScaled, aL, map){

		var trans;
		var matchCp = cpManager.getMatchedCP();
		var n = matchCp[0].length;
		if(n == 2){
			trans = new SimilarityTransformation(matchCp[1], matchCp[2]);
		}else if(n > 2 && n < 6){
			trans = new AffineTransformation(matchCp[1], matchCp[2]);
		}else if(n > 5){
			alert("polynomial");
		}
		if(trans != null){
			var ll = imgModelScaled.getImageModel().getCartesianLowerLeft_Image1Q();
			var ul = imgModelScaled.getImageModel().getCartesianUpperLeft_Image1Q();
			var ur = imgModelScaled.getImageModel().getCartesianUpperRight_Image1Q();
			var lr = imgModelScaled.getImageModel().getCartesianLowerRight_Image1Q();
			var tmp = new Array();
			tmp.push(ll);
			tmp.push(ul);
			tmp.push(ur);
			tmp.push(lr);
			var xyProjArray = trans.transform(tmp);
			if(imageBoundaryOnMap != null){
				map.removeLayer(imageBoundaryOnMap);
			}
imageBoundaryOnMap = L.polygon(xySwap(xyProjArray)).addTo(map);
			
		}
	}

	//------------------------------------------
	//DataTables http://www.datatables.net
	//------------------------------------------
	
	function addControlPointToTable(cpTable, cpId, xImage, yImage, xMap, yMap){
		var tmpArray = new Array();
		if(cpId.length > 0){
			var rowArray = getRowFromTable(cpTable, cpId);//Gets the existing the already existing values in the table
			var xI, yI, xM, yM;
			if(rowArray != null){
				var rowId = rowArray[0];
				var row = rowArray[1];
				xI = (xImage != null) ? xImage : row[1];
				yI = (yImage != null) ? yImage : row[2];
				xM = (xMap != null) ? xMap : row[3];
				yM = (yMap != null) ? yMap : row[4];
				cpTable.fnDeleteRow(rowId);
			}else{
				xI = xImage;
				yI = yImage;
				xM = xMap;
				yM = yMap;
			}
			tmpArray.push(cpId);
			tmpArray.push(xI);
			tmpArray.push(yI);
			tmpArray.push(xM);
			tmpArray.push(yM);
			cpTable.fnAddData(tmpArray);
		}
	}

	//Returns the index and the row values of the table 
	function getRowFromTable(cpTable, cpId){
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
	
    /* Add a click handler to the rows - this could be used as a callback */
    $("#controlPointsTableDiv").on('click', '#controlPointsTable tbody tr', function( e ) {
        if ( $(this).hasClass('row_selected') ) {
            $(this).removeClass('row_selected');
			mkManager.selectMarker(-1);
        }
        else {
            cpTable.$('tr.row_selected').removeClass('row_selected');
            $(this).addClass('row_selected');
			var cpId = cpTable.$('tr.row_selected')[0].children[0].innerHTML;
			mkManager.selectMarker(cpId);
        }
    });
     
    /* Add a click handler for the delete row */
    $('#delete').click( function() {
        var anSelected = fnGetSelected( cpTable );
        if(anSelected.length !== 0){
			var selRow = cpTable.fnDeleteRow(anSelected[0]);
			var cpId = selRow[0]._aData[0]
			mkManager.removeMarker(cpId);
        }
    } );


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
					//Remove control points
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