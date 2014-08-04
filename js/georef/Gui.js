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


var mapAreaVertexTable;//


var imageBoundaryOnMap;
var imageMapAreaOnMap;
var drawnItemsImage = new L.FeatureGroup();
var drawnItemsMap = new L.FeatureGroup();
var c;//Constants
var trans;//Transformation
var imageMapArea;//Area of the mapArea in the image (pixels)

//Metadata holding variables
var paperMapSize;
var paperMapScale;
var paperMapPlaces;
var paperMapDescription;
var mapAreawkt;

$(document).ready(function () {
	c = new Constants();
	$( document ).tooltip();//enables JQuery UI tooltips
	
	//------------------------------------------
	// Initialization
	//------------------------------------------
	initmap();
	
	$('#controlPointsTableDiv').html( '<table cellpadding="0" cellspacing="0" border="0" class="display" id="controlPointsTable"></table>' );
	cpTable = $('#controlPointsTable').dataTable( {
		"aaData": null,
		"aoColumns": [
			{ "sTitle": "CP Id", "sClass": "center", "bVisible": true},
			{ "sTitle": "Im X", "sClass": "center", "bVisible": false},
			{ "sTitle": "Im Y", "sClass": "center", "bVisible": false},
			{ "sTitle": "Map X", "sClass": "center", "bVisible": false},
			{ "sTitle": "Map Y", "sClass": "center", "bVisible": false}
		]
	} ); 
	
	$('#mapAreaVertexTableDiv').html( '<table cellpadding="0" cellspacing="0" border="0" class="display" id="mapAreaVertexTable"></table>' );
	mapAreaVertexTable = $('#mapAreaVertexTable').dataTable( {
		"bFilter": false,
		"bInfo": false,
		"bSort": false,
		"bPaginate": false,
		"aaData": null,
		"aoColumns": [
			{ "sTitle": "X", "sClass": "center", "bVisible": false},
			{ "sTitle": "Y", "sClass": "center", "bVisible": false},
		]
	} ); 
	
	
	//Adds the combo with the ontology classes
	$.get(c.getConstant("ONTOLOGY_URL"), function(xmlResponse){
		var rdfClasses = getRdfClasses(xmlResponse);
		var counter = 0;
		for(var i = 0; i < rdfClasses.length; i++){
			if(rdfClasses[i].children.length == 0){
				$("#contentTags").append("<p id='pOntologyContentTag" + counter +"'><input type='checkbox' id='" + rdfClasses[i].name + "' value='" + rdfClasses[i].uri + "' class='chOntologyContent' >" + rdfClasses[i].name + " - <a href='" + rdfClasses[i].uri + "' target='_blank'>view</a> <a href='javascript: void(0)' onclick='removeElement(&quot;pOntologyContentTag" + counter + "&quot;)'>remove</a></p>");				
				counter++;
			}
		}
	}) 


	
	//SPECIFIC AUTHOR NAME SEARCH ON THE LIBRARY OF MUENSTER
	//Comment this function for deactivate the autocomplete
	//Autocomplete functions for map creator from LOBID
    $('#paperMapCreator').each(function() {
        var $input = $(this);
        $input.autocomplete({
            source : function(request, response) {
                $.ajax({
                    url : "http://api.lobid.org/person",
                    dataType : "jsonp",
                    data : {
                        name : request.term,
                        format : "ids"
                    },
                    success : function(data) {
                        response(data);
                    }
                });
            }
        });
    });	
	
	
	
	
	//------------------------------------------
	//LEAFLET http://leafletjs.com/
	//------------------------------------------
	
	
	/**
	*Initialize the maps.
	*/
	function initmap(){

		//Map start - The origin of the image in the map is 0,0 and it falls in the 1st quadrant.
		map = L.map('map').setView([51.96236,7.62571], 12);//Default CRS is EPSG3857 spherical mercator -- http://www.epsg-registry.org/report.htm?type=selection&entity=urn:ogc:def:crs:EPSG::3857&reportDetail=short&style=urn:uuid:report-style:default-with-code&style_name=OGP%20Default%20With%20Code&title=EPSG:3857
		mapImage = L.map('mapImage', {center: [imageMapMaxSize/2, imageMapMaxSize/2],zoom: 12,crs: L.CRS.Simple});	//Plane SRS to put the map-image
		mkManager = new MarkerManager(cpManager, drawnItemsImage, drawnItemsMap);
		
		//Adds layers
		/*L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
			maxZoom: 18,
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
		}).addTo(map);*/
		
		
		
		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			attribution: '&amp;copy; &lt;a href="http://osm.org/copyright"&gt;OpenStreetMap&lt;/a&gt; contributors'
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
				featureGroup: drawnItemsImage,
				edit: false//TODO: Unables edition but it's not working
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
				featureGroup: drawnItemsMap,
				edit: false//TODO: Unables edition not working
			}
		});
		mapImage.addControl(drawControlImage);
		map.addControl(drawControlMap);
		
		//Map event
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
					printRulerProperties(mkManager.getRulerCoords(), imgModelScaled);
				}
			}
			updateMetadata();
		});	

		//Map event
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

		//Map event
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
			updateMetadata();
		});

		//Map event
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

	}

	/**
	* Creates a transformation from the control points in the CP Manager object
	* @param {ControlPointManager} cpManager - A control point manager object.
	* @returns A transformation object (AffineTransformation, SimilarityTransformation) 
	*/
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
				//Polynomial transformations are unstable under big geometric differences in maps
				//Besides, WKT encoding of curve lines can be complicated
			}
		}
		return res;
	}
	
	/**
	* Returns the limits of the image in map coordinates
	* @param trans - A transformation object.
	* @param {ScaledImage} imgModelScaled - Scaled image model.
	* @returns An array of arrays [x,y]
	*/
	function getImageBoundariesInMapCoords(trans, imgModelScaled){
		var imgBnd = new Array();
		//Gets image coords
		imgBnd.push(imgModelScaled.getImageModel().getCartesianLowerLeft_Image1Q());
		imgBnd.push(imgModelScaled.getImageModel().getCartesianUpperLeft_Image1Q());
		imgBnd.push(imgModelScaled.getImageModel().getCartesianUpperRight_Image1Q());
		imgBnd.push(imgModelScaled.getImageModel().getCartesianLowerRight_Image1Q());
		//Projects coords
		var xyProjArrayBnd = trans.transform(imgBnd);
		return xyProjArrayBnd;
	}
	
	/**
	* Draws the image boundaries and map area on the map.
	* @param {ControlPointManager} cpManager - A control point manager object.
	* @param {ScaledImage} imgModelScaled - Scaled image model.
	* @param mapAreaLatLonArray - An array of Leaflet LatLng objects on scaled image's coordinates
	* @param {L.Map} map - The map where the boundaries are going to be drawn.
	*/
	function projectImageBoundaries(cpManager, imgModelScaled, mapAreaLatLonArray, map){
		trans = createTransformation(cpManager);
		mapAreawkt = "";
		var c = new Constants();
		if(trans != null){
			var mapAreaBnd = new Array();
			var xyProjArrayBnd = getImageBoundariesInMapCoords(trans, imgModelScaled);
			//Gets rid of old boundaries
			if(imageBoundaryOnMap != null){
				map.removeLayer(imageBoundaryOnMap);
			}
			if(imageMapAreaOnMap != null){
				map.removeLayer(imageMapAreaOnMap);
			}
			//Draws the image boundaries
			imageBoundaryOnMap = L.polygon(xySwap(xyProjArrayBnd), c.getConstant("IMAGE_BOUNDARY_POLYGON")).addTo(map);
			var xyProjmapAreaBnd = getBoundary(xyProjArrayBnd);
			//Draws the map area
			if(mapAreaLatLonArray != null){
				//Gets an XY number array from L.Latlng objects
				mapAreaBnd = latlon2xyArray(mapAreaLatLonArray);
				//Scale the coords from scaled image to image
				var unScaledMapAreaBnd = imgModelScaled.unScaleCoordsArray(mapAreaBnd);
				//imageMapArea = calculatePolygonArea(unScaledMapAreaBnd);//No longer required
				//Transform the coords from image refsys to map refsys
				var xyProjmapAreaBnd = trans.transform(unScaledMapAreaBnd);
				mapAreawkt = xyArray2wktPolygon(xyProjmapAreaBnd, c.getConstant("SPATIAL_REFERENCE_SYSTEM"));
				//mapAreaArea = calculatePolygonArea(xyProject(xyProjmapAreaBnd, L.Projection.SphericalMercator));//Leaflet transformation problem http://leafletjs.com/reference.html#icrs
				$("#mapAreaDetails").html("");
				mapAreaVertexTable.fnClearTable();
				mapAreaVertexTable.fnAddData(xyProjmapAreaBnd);
				//$("#mapAreaDetails").append(roundNumber(mapAreaArea/1000000,1) + "squared kilometers");
				imageMapAreaOnMap = L.polygon(xySwap(xyProjmapAreaBnd), c.getConstant("MAP_AREA_POLYGON")).addTo(map);
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
	
	/**
	* Prints calculation derived from the ruler drawn by the user
	* @param {L.LatLng} rulerCoords - Array of LatLng objects representing the ruler's vertexs
	* @param {ScaledImage} imgModelScaled - Scaled image model.
	*/
	function printRulerProperties(rulerCoords, imgModelScaled){
		$("#rulerDetails").html("");
		paperMapSize = "";
		paperMapScale = "";
		if(rulerCoords != null && imgModelScaled != null && trans != null){
			//Gets an XY number array from L.Latlng objects
			var xyScaledRuler = latlon2xyArray(rulerCoords);
			//Scale the coords from scaled image to image
			var imgRuler = imgModelScaled.unScaleCoordsArray(xyScaledRuler);
			//Transform the coords from image refsys to map refsys
			var mapRuler = trans.transform(imgRuler);
			//Distance estimation
			var imageDistance = pointArrayDistance(xyArray2point(imgRuler));//Pixels
			var mapDistance = latLngArrayDistance(xyArray2latlon(mapRuler));//Meters
			//Scales
			var factor = 100;//var measurement = 1 / factor;//1 cm
			var mapScaleFactor = mapDistance * factor;
			
			var paperW = imgModelScaled.getImageModel().getWidth() / imageDistance;
			var paperH = imgModelScaled.getImageModel().getHeight() / imageDistance;
			
			paperMapSize = roundNumber(paperW,1) + " * " + roundNumber(paperH,1) + " cm";//74 * 95 cm
			paperMapScale = "1:" + roundNumber(mapScaleFactor,1);
			
			$("#rulerDetails").html("<b><i>Ruler distance (1 cm):</i></b><br>");
			$("#rulerDetails").append(roundNumber(imageDistance,1) + " pixels (approximated)<br>");
			$("#rulerDetails").append(roundNumber(mapDistance,1) + " meters (approx)<br><br>");
			$("#rulerDetails").append("<b><i>Map scale:</b></i>: " + paperMapScale + " (approx)<br>");
			$("#rulerDetails").append("<b><i>Paper map size:</b></i> " + paperMapSize + " (approx)<br>");
		}
	}
	
	
	/**
	* Retrieves Dbpedia entries related in space and time
	* @param xybbox - Array of [x,y] with the map area's vertexs.
	* @param {inetger} yearStart - Start year to search.
	* @param {inetger} yearEnd - End year to search.
	* @returns Array of arrays [url, label, abstract]
	*/
	function queryDbpediaST(xybbox, yearStart, yearEnd){
		var res = new Array();
		
		var abstractLength = c.getConstant("ABSTRACT_LENGTH");
		var sq = new SparqlQuery();
		var query = c.getConstant("PREFIXES") + " " + c.getConstant("QUERY_BOX_YEAR");
		
		var xMin = xybbox[0];
		var yMin = xybbox[1];
		var xMax = xybbox[2];
		var yMax = xybbox[3];
		query = query.replace("<PARAM_XMIN>", xMin);
		query = query.replace("<PARAM_YMIN>", yMin);
		query = query.replace("<PARAM_XMAX>", xMax);
		query = query.replace("<PARAM_YMAX>", yMax);
		query = replaceAll("<PARAM_YEAR_START>", yearStart, query);
		query = replaceAll("<PARAM_YEAR_END>", yearEnd, query);
		
		try{
			//Fails when DBpedia is offline - You don't say!
			var js = sq.sendSparqlQuery(query, c.getConstant("DBPEDIA_SPARQL"), "");
			if(js.results.bindings.length < 1){
				alert("No spatio-temporal related  results were found!");
			}
			for(var i = 0; i < js.results.bindings.length; i++){
				var subject = js.results.bindings[i].subject.value;
				var label = js.results.bindings[i].label.value;
				var abst = js.results.bindings[i].abst.value;
				abst = abst.substring(0, abstractLength) + "...";
				var tmpArray = new Array(subject, label, abst);
				res.push(tmpArray);
			}
		}catch(err){
			console.log(err); 
		}
		return res;
	}
	
	
	/**
	* Prints suggested Points of Interest taken from DBPedia . Purely spatial.
	* @param xybbox - Array of [x,y] with the map area's vertexs.
	*/
	function queryDbpedia(xybbox){
		var sq = new SparqlQuery();
		var query = c.getConstant("PREFIXES") + " " + c.getConstant("QUERY_CITYS");

		var xMin = xybbox[0];
		var yMin = xybbox[1];
		var xMax = xybbox[2];
		var yMax = xybbox[3];
		query = query.replace("<PARAM_XMIN>", xMin);
		query = query.replace("<PARAM_YMIN>", yMin);
		query = query.replace("<PARAM_XMAX>", xMax);
		query = query.replace("<PARAM_YMAX>", yMax);
		try{
			//Fails when DBpedia is offline
			var js = sq.sendSparqlQuery(query, c.getConstant("DBPEDIA_SPARQL"), "");
			$("#suggestedControlPointsTableDiv").html("");
			$("#suggestedControlPointsTableDiv").append("<b><i>POI Suggestions: </i></b>");
			paperMapPlaces = "";
			if(js.results.bindings.length < 1){
				alert("No POIs were found in this zone!");
			}
			for(var i = 0; i < js.results.bindings.length; i++){
				var lng = js.results.bindings[i].lg.value;
				var lat = js.results.bindings[i].lt.value;
				$("#suggestedControlPointsTableDiv").append('<a href="javascript: void(0)" onclick="zoomToSuggestion(&quot;' + lng + '&quot; , &quot;' + lat + '&quot;)">' + js.results.bindings[i].label.value + "</a>");
				$("#suggestedControlPointsTableDiv").append(", ");
				paperMapPlaces = (paperMapPlaces != "") ? paperMapPlaces + " , " + js.results.bindings[i].label.value : paperMapPlaces;
			}
		}catch(err){
			console.log(err); 
		}
	}
	
	/**
	* Updates the metadata form with some data derived from the georeferenciation.
	*/
	function updateMetadata(){
		$("#paperMapSize").val(paperMapSize);
		$("#paperMapScale").val(paperMapScale);
		$("#paperMapPlaces").val(paperMapPlaces);
		$("#mapAreawkt").val(mapAreawkt);
	}

	/**
	* Validates the data in the metadata tab.
	*/
	function validateMetadata(){
		var res = true;

		var c = new Constants();
		var paperMapUri = $("#paperMapUri").val();
		var d = new Date();
		var messages = new Array();
		var imageMapUri;
		var dateSeparator = c.getConstant("DATE_SEPARATOR");
		
		if(imgModelOriginal != null){
			imageMapUri = imgModelOriginal.getUrl();
		}
		if(isUrlOfImage(imageMapUri)){
			if(isUriValid(paperMapUri)){

				paperMapCreator = $.trim($("#paperMapCreator").val());
				paperMapSize = $.trim($("#paperMapSize").val());
				paperMapTitle = $.trim($("#paperMapTitle").val());
				paperMapTime = $.trim($("#paperMapTime").val());
				if(paperMapTime != null){
					if(paperMapTime.length > 3){
						if(paperMapTime.indexOf(dateSeparator) >= 0){
							var strDates = paperMapTime.split(dateSeparator);
							if(isPositiveInteger(strDates[0].trim()) == false || isPositiveInteger(strDates[1].trim()) == false){
								messages.unshift("Invalid map time. Expected is like '1810' or '1810-1819'. Please review it in the Map Metadata tab.");
							}
						}else{
							if(isPositiveInteger(paperMapTime) == false || paperMapTime > d.getFullYear()){
								messages.unshift("Invalid 	map time. Please review it in the Map Metadata tab.");

							}
						}
					}

					paperMapScale = $.trim($("#paperMapScale").val());
					paperMapPlaces = $.trim($("#paperMapPlaces").val());
					mapAreawkt = $.trim($("#mapAreawkt").val());
				}else{
					messages.unshift("The map URI is invalid. Please review it in the Map Metadata tab.");
				}
			}else{
				messages.unshift("The image URL is invalid. Please review it in the image tab.");
			}
		}
		if(messages.length > 0){
			var msgstr = "";
			for (var i = 0; i < messages.length; i++){
				if(i == 0){
					msgstr = messages[i] + "\n";
				}else{
					msgstr += messages[i];
				}
			}
			alert(msgstr);
			res = false;
		}
		return res;
	}
	
	
	/**
	* Build the triples to be sent to the triple store
	*/
	function buildTriples(graph){
		var res;
		var c = new Constants();
		var baseUri = c.getConstant("HOME_URI");

		var prefix = c.getConstant("PREFIXES");
		var insertTemplate = c.getConstant("QUERY_INSERT");
		var imageMapUri = imgModelOriginal.getUrl()
		var tripleSeparator = " . ";// + String.fromCharCode(13);
		var pmu = $("#paperMapUri").val();
		var paperMapUri = "<" + pmu + "> ";
		if(validateMetadata()){
			//Gets the data from the form (in case the user changed something)
			paperMapCreator = getStringEscaped($.trim($("#paperMapCreator").val()));
			paperMapSize = $.trim($("#paperMapSize").val());
			paperMapTitle = getStringEscaped($.trim($("#paperMapTitle").val()));
			paperMapTime = $.trim($("#paperMapTime").val());
			paperMapScale = $.trim($("#paperMapScale").val());
			paperMapPlaces = $.trim($("#paperMapPlaces").val());
			paperMapDescription = getStringEscaped($.trim($("#taMapDescription").val()));
			mapAreawkt = $.trim($("#mapAreawkt").val());
			var paperMapPlacesArray = csv2array(paperMapPlaces);//Get the list of user's places as an array
			
			//Triples for map
			var cMapTriples = "";
			// paper map
			cMapTriples = paperMapUri + "a <http://www.geographicknowledge.de/vocab/maps#Map>" + tripleSeparator;
			cMapTriples += paperMapUri + "<http://www.geographicknowledge.de/vocab/maps#medium> <http://www.geographicknowledge.de/vocab/maps#Paper>" + tripleSeparator;
			// Relation paper - image
			cMapTriples += paperMapUri + "<http://www.geographicknowledge.de/vocab/maps#digitalImageVersion> <" + imageMapUri + ">" + tripleSeparator;
			//Size
			if(paperMapSize != null && paperMapSize.length > 0){
				cMapTriples += paperMapUri + "<http://www.geographicknowledge.de/vocab/maps#mapSize> '" + paperMapSize + "'^^xsd:string" + tripleSeparator;
			}
			//paper map title
			if(paperMapTitle != null && paperMapTitle.length > 0){
				cMapTriples += paperMapUri + "<http://www.geographicknowledge.de/vocab/maps#title> '" + paperMapTitle + "'^^xsd:string" + tripleSeparator;
			}
			
			//paper map time
			if(paperMapTime != null && paperMapTime.length > 0){
				var dateArray = paperMapTime.split("-");
				var dateFrom = "";
				var dateTo = "";
				var tripleFrom = "";
				var tripleTo = "";
				var timeTriple = "";

				if(dateArray.length > 0){
					if(dateArray.length == 1){
						dateFrom = dateArray[0];
						dateFrom = dateFrom.trim();
						tripleFrom = "<" + pmu + "/mapRepresentationTime> a <http://www.w3.org/2006/time#Instant>" + tripleSeparator;
						tripleFrom += "<" + pmu + "/mapRepresentationTime> <http://www.w3.org/2001/XMLSchema#gYear> '" + dateFrom + "'" + tripleSeparator;
						timeTriple = tripleFrom;
					}else if(dateArray.length == 2){
						dateFrom = dateArray[0];
						dateFrom = dateFrom.trim();
						dateTo = dateArray[1];
						dateTo = dateTo.trim();
						tripleFrom = "<" + pmu + "/mapRepresentationTime/start> a <http://www.w3.org/2006/time#Instant>" + tripleSeparator;
						tripleFrom += "<" + pmu + "/mapRepresentationTime/start> <http://www.w3.org/2001/XMLSchema#gYear> '" + dateFrom + "'" + tripleSeparator;
						tripleTo = "<" + pmu + "/mapRepresentationTime/end> a <http://www.w3.org/2006/time#Instant>" + tripleSeparator;
						tripleTo += "<" + pmu + "/mapRepresentationTime/end> <http://www.w3.org/2001/XMLSchema#gYear> '" + dateTo + "'" + tripleSeparator;
						var intervalTriple = "<" + pmu + "/mapRepresentationTime> a <http://www.w3.org/2006/time#Interval>" + tripleSeparator;
						intervalTriple +=  "<" + pmu + "/mapRepresentationTime> <http://www.w3.org/2006/time#hasBeginning> <" + pmu + "/mapRepresentationTime/start>" + tripleSeparator;
						intervalTriple +=  "<" + pmu + "/mapRepresentationTime> <http://www.w3.org/2006/time#hasEnd> <" + pmu + "/mapRepresentationTime/end>" + tripleSeparator;
						timeTriple	=  intervalTriple + tripleFrom + tripleTo;
					}
					cMapTriples += paperMapUri + "<http://www.geographicknowledge.de/vocab/maps#mapsTime> <" + pmu + "/mapRepresentationTime>" + tripleSeparator;
					cMapTriples += timeTriple;
				}
			}
			
			//paper map scale
			if(paperMapScale != null && paperMapScale.length > 0){
				cMapTriples += paperMapUri + "<http://www.geographicknowledge.de/vocab/maps#hasScale> '" + paperMapScale + "'^^xsd:string" +  tripleSeparator;
			}
			//paper map area en map coords
			if(mapAreawkt != null && mapAreawkt.length > 0){
				//Get a name for the Geometry object (map area)
				var geomName = imageMapUri + "/" + djb2Code(imageMapUri);
				cMapTriples += "<" + geomName + "> a geo:Geometry " +  tripleSeparator;
				cMapTriples += paperMapUri + "<http://www.geographicknowledge.de/vocab/maps#mapsArea> " + "<" + geomName + "> " +  tripleSeparator;
				cMapTriples += "<" + geomName + "> geo:asWKT '" + mapAreawkt + "'^^sf:wktLiteral" +  tripleSeparator;
			}
			//paper map description
			if(paperMapDescription != null && paperMapDescription.length > 0){

				var tmpDescription = paperMapDescription.replace("'",'\"');

				cMapTriples += paperMapUri + "<http://purl.org/dc/terms/description> '" + paperMapDescription + "'^^xsd:string" +  tripleSeparator;
			}
			
			//Triples for places typed by the user. Creates a new URI for each place
			var cPlaceTriples = "";	
			if(paperMapPlacesArray != null){
				for(var i = 0; i < paperMapPlacesArray.length; i++){
					var tmpPlace = encodeURI(baseUri + "/" + paperMapPlacesArray[i]);
					cPlaceTriples += "<" + tmpPlace + "> a <http://www.geographicknowledge.de/vocab/maps#Place>" + tripleSeparator; 
					cPlaceTriples += "<" + tmpPlace + "> foaf:name '" + paperMapPlacesArray[i] + "'^^xsd:string" + tripleSeparator;
					//Links the paper map to the place just created
					cMapTriples += paperMapUri + "<http://www.geographicknowledge.de/vocab/maps#mapsPhenomenon> <" + tmpPlace + ">" + tripleSeparator;
				}
			}
			
			//Triples about the map's author
			var cAgentTriples = "";
			if(paperMapCreator != null && paperMapCreator.length > 0){
				var tmpMapCreator =  encodeURI(baseUri + "/" + paperMapCreator);
				cAgentTriples = paperMapUri + " <http://purl.org/dc/terms/creator> <" + tmpMapCreator + ">" + tripleSeparator;
				cAgentTriples += "<" + tmpMapCreator + "> a <http://purl.org/dc/terms/Agent>" + tripleSeparator;
				cAgentTriples += "<" + tmpMapCreator + "> foaf:name '" + paperMapCreator + "'^^xsd:string" + tripleSeparator;
			}

			//Builds triples form the checkboxes
			
			//DBpedia places matched from user's places. Alphanumeric
			$(".chPlaceSuggestion").each(function( index ){
				if(this.checked){
					cMapTriples += paperMapUri + "<http://www.geographicknowledge.de/vocab/maps#mapsPhenomenon> <" +  this.value + ">" + tripleSeparator;
				}
			});
			//DBpedia retrieved from the image map boundary and the user's typed year- spatio temporal places
			$(".chMapLinkSuggestion").each(function( index ){
				if(this.checked){
					cMapTriples += paperMapUri + "<http://www.geographicknowledge.de/vocab/maps#mapsPhenomenon> <" +  this.value + ">" + tripleSeparator;
				}
			});
			//DBpedia - Links found in the user's description
			$(".chDescriptionSuggestion").each(function( index ){
				if(this.checked){
					cMapTriples += paperMapUri + "<http://purl.org/dc/terms/references> <" +  this.value + ">" + tripleSeparator;
					//http://www.geographicknowledge.de/vocab/maps#mapsPhenomenon
					
				}
			});
			//Triples from the ontology
			$(".chOntologyContent").each(function( index ){
				if(this.checked){
					var tmpInstance = djb2Code(pmu + "/" + this.value);
					cMapTriples += paperMapUri + " a <" + this.value  + ">" + tripleSeparator;
					cMapTriples += paperMapUri + "<http://www.geographicknowledge.de/vocab/maps#mapsPhenomenon> _:" +  tmpInstance + tripleSeparator;
				}
			});
			
			//Replace in the insert template
			insertTemplate = insertTemplate.replace("PARAM_GRAPH", graph);
			insertTemplate = insertTemplate.replace("PARAM_TRIPLES", cMapTriples + cPlaceTriples + cAgentTriples);
			var queryInsert = prefix + " " + insertTemplate;
			//queryInsert = queryInsert.replace(/(\r\n|\n|\r)/gm,"");//Removes \r
			res = queryInsert;
			
		}

		return res;
	}
	
	//------------------------------------------
	//DataTables http://www.datatables.net
	//------------------------------------------

	/**
	* Updates the table with data from a map control point.
	* @param cpTable - Table for displaying control point data.
	* @param {string} cpId - Control point's identifier.
	* @param {double} xMap - Control point's x coord in the map.
	* @param {double} yMap - Control point's y coord in the map.
	*/
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
	
	/**
	* Updates the table with data from a image control point.
	* @param cpTable - Table for displaying control point data.
	* @param {string} cpId - Control point's identifier.
	* @param {double} xImg - Control point's x coord in the image.
	* @param {double} yImg - Control point's y coord in the image.
	*/
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

	
	/**
	* Returns the index and the row values from the table for a given control point
	* @param cpTable - Table displaying control point data.
	* @param {string} cpId - Control point's identifier.
	* @returns An array [index, {rowValue1, rowValue2,...}]
	*/
	function getRowFromTable(cpTable, cpId){//, xImg, yImg){
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
	
	/**
	* Returns the index of the row in the table (aoData array index)
	* @param cpTable - Table displaying control point data.
	* @param {string} cpId - Control point's identifier.
	* @returns An integer indicating the position of the control point in the table's array.
	*/
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

	
	//Button - store. Gets the data, creates a new graph, builds triples and send them to the triple store
	$(function(){
		$( "#btStoreTriples" ).click(function(){
			paperMapUri = $("#paperMapUri").val();
			var imageMapUri;
			var c = new Constants();
			if(imgModelOriginal != null){
				imageMapUri = imgModelOriginal.getUrl()
			}
			if(isUrlOfImage(imageMapUri)){
				if(isUrlValid(paperMapUri)){
					var graph = createGraphName(c.getConstant("HOME_URI"), paperMapUri);
					var queryCreate = c.getConstant("QUERY_CREATE_GRAPH");
					queryCreate = queryCreate.replace("PARAM_GRAPH", graph);
					var queryInsert = buildTriples(graph);
					try{

						//Creates a new SPARQL GRAPH
						var sq = new SparqlQuery();
						var js = sq.sendSparqlUpdate(queryCreate, c.getConstant("HOME_SPARQLENDPOINT"), graph);
						//Insert the triples in the new GRAPH
						sq = new SparqlQuery();
						var js = sq.sendSparqlUpdate(queryInsert, c.getConstant("HOME_SPARQLENDPOINT"), graph);
						alert("Map data inserted!");
					}catch(err){
						alert(err);
						console.log(err); 
					}
				}else{
					alert("The map URI is invalid. Please review it in the Map Metadata tab.");
				}
			}else{
				alert("The image URL is invalid. Please review it in the image tab.");
			}
		});
	});

	//Button - Get KML. Opens a new window with KML code for displaying the image on Google Earth.
	$(function(){
		$( "#btGenerateKml" ).click(function(){
			trans = createTransformation(cpManager);
			if(trans != null && imgModelScaled != null){
				var imgUrl = imgModelScaled.getImageModel().getUrl();
				var xyProjArrayBnd = getImageBoundariesInMapCoords(trans, imgModelScaled);
				var xyProjmapAreaBnd = getBoundary(xyProjArrayBnd);
				
				var west = xyProjmapAreaBnd[0];
				var south = xyProjmapAreaBnd[1];
				var east = xyProjmapAreaBnd[2];
				var north = xyProjmapAreaBnd[3];
				var rotation = calculateRotation(xyProjArrayBnd);
				
				var kml = getOverlayText(imgUrl, north, south, east, west, rotation);
				var wincode = c.getConstant("CODE_WINDOW_HTML_PREFIX");
				wincode = wincode.replace("<PARAM_WINDOW_TITLE>", "Georeferencer - KML");
				wincode += kml + c.getConstant("CODE_WINDOW_HTML_SUFIX");
				var win = window.open(c.getConstant("CODE_WINDOW_PROPERTIES"));
				win.document.write(wincode);
				win.document.close(); 
			}else{
				alert("Please add at least 3 control points to continue!");
			}
			
		});
	});

	//Button - Get RDF. Opens a new window with RDF.
	$(function(){
		$( "#btGenerateRdf" ).click(function(){
			if(validateMetadata()){
				paperMapUri = $("#paperMapUri").val();
				var imageMapUri = imgModelOriginal.getUrl()
				var c = new Constants();	
				var graph = createGraphName(c.getConstant("HOME_URI"), paperMapUri);
				var queryInsert = buildTriples(graph);
				var win = window.open(c.getConstant("CODE_WINDOW_PROPERTIES"));
				var wincode = c.getConstant("CODE_WINDOW_HTML_PREFIX");
				wincode = wincode.replace("<PARAM_WINDOW_TITLE>", "Georeferencer - RDF");
				wincode += queryInsert + c.getConstant("CODE_WINDOW_HTML_SUFIX");
				win.document.write(wincode);
				win.document.close(); 
			}
		});
	});
	
	//Button - Updates the suggested points of interest
	$(function(){
		$( "#btSuggestPois" ).click(function(){
			if(trans != null && imgModelScaled !== null){
				var xyProjArrayBnd = getImageBoundariesInMapCoords(trans, imgModelScaled);
				var xyProjmapAreaBnd = getBoundary(xyProjArrayBnd);
				$("body").css("cursor", "progress");
				queryDbpedia(xyProjmapAreaBnd);
				$("body").css("cursor", "default");
			}
		});
	});	
	
	
	/**
	* Creates a name for the graph of the map from a prefix and the map URI
	*/
	function createGraphName(prefix, mapURI){
		var res = "";
		if(prefix.length > 1 && mapURI.length > 1){
			var tmp = djb2Code(mapURI);
			if(prefix.substr(prefix.length - 1) == "/"){
				res = prefix + tmp;
			}else{
				res = prefix + "/" + tmp;
			}
		}
		return res;
	}
	
	
	/**
	* Prints suggested places taken from DBPedia. Purely alphanumerical.
	*/
	function queryDbpediaSuggestedPlaces(){
		paperMapPlaces = $.trim($("#paperMapPlaces").val());
		$.ajax({
			//Uses DBpedia spotlight
			url: "http://spotlight.dbpedia.org/rest/annotate?text=" + escape(paperMapPlaces) + "&confidence=0.0&support=00&types=Place",
			headers: { 
				Accept : "application/json; charset=utf-8",
				"Content-Type": "text/plain; charset=utf-8"
			},
			}).done(function ( data ) {

				$("#placeTags").html("");
				var tmp = new Array();
				if(data != null && data.Resources != null){
					for(var i = 0; i < data.Resources.length; i++){
						var obj = data.Resources[i];
						var subject = obj["@URI"];
						if(tmp.indexOf(subject) < 0){//Avoid duplicated tags
							tmp.push(subject);
							//var originalText = obj["@surfaceForm"];
							//Gets the URL last part
							var matchedText = subject.substring(subject.lastIndexOf("/") + 1, subject.length);
							//Creates the checkboxes					
							$("#placeTags").append("<p id='pSuggestedPlaceTag" + tmp.length +"'><input type='checkbox' id='" + subject + "' value='" + subject + "' class='chPlaceSuggestion' >" + matchedText + " - <a href='" + subject + "' target='_blank'>view</a> <a href='javascript: void(0)' onclick='removeElement(&quot;pSuggestedPlaceTag" + tmp.length + "&quot;)'>remove</a></p>");
							//Completes the subject with the label and abstract -getDbpediaLabelAbstract();
						}
					}
				}

			}
		);	
	
	}


	/**
	* Fills a list of places matching the user search on the map
	*/
	$('#searchMapPlaces').each(function() {
		var $input = $(this);
		$input.autocomplete({
			source : function(request, response) {
				$.ajax({
					url : "http://api.geonames.org/searchJSON",
					dataType : "json",
					data : {
						q : request.term,
						maxRows : "5", 
						fuzzy : "0.8", 
						username: "hamersson", 
						format : "lat"
					},
					success : function(data) {
						//Filter JSON objects
						var myArray1 = new Array();
						var gn = data.geonames;
						for (i = 0;i < gn.length; i++) {
							var tmpObj = {};
							tmpObj.label = gn[i].name + ", " + gn[i].countryName;
							tmpObj.value = gn[i].name + ", " + gn[i].countryName + " (Lon: " + gn[i].lng + "; Lat: " + gn[i].lat + ")";
							myArray1[i] = tmpObj;
						}
						response(myArray1);
					}
				});
			},
			select: function( event, ui ) {
				str = ui.item.value;
				tmp1 = str.substring(str.indexOf(":") + 2 , str.lastIndexOf(")"));
				tmp2 = tmp1.split(";");
				lng = tmp2[0];
				lat = tmp2[1].substring(tmp2[1].indexOf(":") + 1);
				zoomToSuggestion(lng, lat);
			}
		});
	});	


	/**
	* Goes to DBpedia and retrieves the label and abstract for a given subject
	* @param uriSubject Subject's URI.
	* @ returns A string array [uriSubject, label, abstract]
	*/
	function getDbpediaLabelAbstract(uriSubject){
		var res = new Array();
		var query = c.getConstant("PREFIXES") + " " + c.getConstant("QUERY_COMPLETE_SUBJECT");
		var sq = new SparqlQuery();
		var abstractLength = c.getConstant("getConstant");
		
		query = query.replace("<PARAM_URI>", uriSubject);
		try{
			var js = sq.sendSparqlQuery(query, c.getConstant("DBPEDIA_SPARQL"), "");
			if(js.results.bindings.length > 0){
				var label = js.results.bindings[0].label.value;
				var abst = js.results.bindings[0].abst.value;
				//Trims the abstract
				abst = abst.substring(0, abstractLength) + "...";
				res.push(uriSubject);
				res.push(label);
				res.push(abst);
			}else{
				alert("No suggestions were found!");
			}
		}catch(err){
			console.log(err); 
		}
		return res;
	}
	

	//Button - load image. Loads the image to the map
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
				}
				image.src = imageUrl;	
			}else{
				alert("Invalid URL!");
			}
		});
	});
	
	//Button - Suggest tags (spatio-temporal references)
	$(function(){
		$( "#btUpdateMapLinks" ).click(function(){
			if(trans != null){
				if(validateMetadata()){
					var c = new Constants();
					var dateSeparator = c.getConstant("DATE_SEPARATOR");
					var year = $.trim($("#paperMapTime").val());
					if(year != null){
						var xyProjArrayBnd = getImageBoundariesInMapCoords(trans, imgModelScaled);
						var xybboxBnd = getBoundary(xyProjArrayBnd);
						var yearStart = "";
						var yearEnd = "";
						if(year.indexOf(dateSeparator) >= 0){
							var yearStrArray = year.split(dateSeparator);
							yearStart = yearStrArray[0] + "-01-01T00:00:00+00:00";//TODO: Find a better way to make the year valid
							yearEnd = yearStrArray[1];//HACK: Machete kills!
						}else{
							yearStart = year + "-01-01T00:00:00+00:00";//TODO: Find a better way to make the year valid
							yearEnd = year;//HACK: Machete kills!
						}
						var stRefs = queryDbpediaST(xybboxBnd, yearStart, yearEnd);
						//Adds check boxes for suggestions
						$("#stSuggestions").empty();
						var tmp = new Array();
						for(var i = 0; i < stRefs.length; i++){
							var ref = stRefs[i];
							var subject = ref[0];
							if(tmp.indexOf(subject) < 0){//Avoid subject repetition
								tmp.push(subject);
								var label = ref[1];
								var abst = ref[2];
								$("#stSuggestions").append("<p id='pStTag" + tmp.length +"'><input type='checkbox' id='" + subject + "' value='" + subject + "' title='" + abst + "' class='chMapLinkSuggestion' >" + label + " - <a href='" + subject + "' target='_blank'>view</a> <a href='javascript: void(0)' onclick='removeElement(&quot;pStTag" + tmp.length + "&quot;)'>remove</a></p>");
							}
						}
					}else{
						alert("Please fill the map time field in the metadata tab.");
					}
				}
			}
		});
	});
		
		
		
	//Button - Find matches to places typed by the user
	$(function(){
		$('#btFindPlaceMatches').click(function() {
			if(validateMetadata()){
				queryDbpediaSuggestedPlaces();
			}
		});
	});		
		
		
	//Button - btFindDescriptionMatches Find dbpedia matches to the description typed by the user
	$(function(){
		$( "#btFindDescriptionMatches" ).click(function(){
			queryDbpediaDescription()
		});
	});
	
	/**
	* Prints suggested places taken from DBPedia. Purely alphanumerical.
	*/
	function queryDbpediaDescription(){
		paperMapDescription = $.trim($("#taMapDescription").val());
		$.ajax({
			//Uses DBpedia spotlight
			url: "http://spotlight.dbpedia.org/rest/annotate?text=" + escape(paperMapDescription) + "&confidence=0.0&support=00",
			headers: { 
				Accept : "application/json; charset=utf-8",
				"Content-Type": "text/plain; charset=utf-8"
			},
			}).done(function ( data ) {
				$("#descriptionTags").html("");
				var tmp = new Array();
				for(var i = 0; i < data.Resources.length; i++){
					var obj = data.Resources[i];
					var subject = obj["@URI"];
					if(tmp.indexOf(subject) < 0){//Avoid subject repetition
						tmp.push(subject);
						//var originalText = obj["@surfaceForm"];
						//Gets the URL last part
						var matchedText = subject.substring(subject.lastIndexOf("/") + 1, subject.length);
						//Creates the checkboxes					
						$("#descriptionTags").append("<p id='pDescriptionTag" + tmp.length +"'><input type='checkbox' id='" + subject + "' value='" + subject + "' class='chDescriptionSuggestion' >" + matchedText + " - <a href='" + subject + "' target='_blank'>view</a> <a href='javascript: void(0)' onclick='removeElement(&quot;pDescriptionTag" + tmp.length + "&quot;)'>remove</a></p>");
						//Completes the subject with the label and abstract -getDbpediaLabelAbstract();
					}
				}

			}
		);	
	
	}
	
	
	
	
});	



//Returns the selected row in the table. It must be outside of the ready function
function fnGetSelected( oTableLocal ){
    return oTableLocal.$('tr.row_selected');
}