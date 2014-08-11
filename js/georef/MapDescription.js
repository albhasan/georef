var MapDescription = (function(){

	var mapDescriptionInstance; //private variable to hold the only instance
	
	var createMapDescription = function(){


		//var that = this;
		var imageUrl;
		var mapUri;
		var mapTitle;
		var mapCreator;
		var mapSize;
		var mapTime;
		var mapScale;
		var mapArea;
		var mapPlaces;
		var mapDescription;
		var mapLinksContents;
		var mapLinksPlaces;
		var mapLinksTags;
		var mapLinksDescription;

		//--------------------------
		//Getters
		//--------------------------
		var getImageUrl = function(){
			return imageUrl;
		};
		var getMapUri = function(){
			return mapUri;
		};
		var getMapTitle = function(){
			return mapTitle;
		};
		var getMapCreator = function(){
			return mapCreator;
		};
		var getMapSize = function(){
			return mapSize;
		};
		var getMapTime = function(){
			return mapTime;
		};
		var getMapScale = function(){
			return mapScale;
		};
		var getMapArea = function(){
			return mapArea;
		};
		var getMapPlaces = function(){
			return mapPlaces;
		};
		var getMapLinks = function(){
			return mapLinks;
		};
		var getMapDescription = function(){
			return mapDescription;
		};
		var getMapLinksContents = function(){
			return mapLinksContents;
		};
		var getMapLinksPlaces = function(){
			return mapLinksPlaces;
		};
		var getMapLinksTags = function(){
			return mapLinksTags;
		};
		var getMapLinksDescription = function(){
			return mapLinksDescription;
		};
		//--------------------------
		//Setters
		//--------------------------

		var setImageUrl = function(aImageUrl){
			imageUrl = aImageUrl;
		};
		var setMapUri = function(aMapUri){
			mapUri = aMapUri;
		};
		var setMapTitle = function(aMapTitle){
			mapTitle = aMapTitle;
		};
		var setMapCreator = function(aMapCreator){
			mapCreator = aMapCreator;
		};
		var setMapSize = function(aMapSize){
			mapSize = aMapSize;
		};
		var setMapTime = function(aMapTime){
			mapTime = aMapTime;
		};
		var setMapScale = function(aMapScale){
			mapScale = aMapScale;
		};
		var setMapArea = function(){
			mapArea = aMapArea;
		};
		var setMapPlaces = function(aMapPlaces){
			mapPlaces = aMapPlaces;
		};
		var setMapLinks = function(aMapLinks){
			mapLinks = aMapLinks;
		};
		var setMapDescription = function(aMapDescription){
			mapDescription = aMapDescription;
		};
		var setMapLinksContents = function(aMapLinksContents){
			mapLinksContents = aMapLinksContents;
		};
		var setMapLinksPlaces = function(aMapLinksPlaces){
			mapLinksPlaces = aMapLinksPlaces;
		};
		var setMapLinksTags = function(aMapLinksTags){
			mapLinksTags = aMapLinksTags;
		};
		var setMapLinksDescription = function(aMapLinksDescription){
			mapLinksDescription = aMapLinksDescription;
		};
	

		/**
		* Build the triples to be sent to the triple store
		*/
		var buildTriples = function(){
			var res;
			var c = Constants.getInstance();
			var graph = createGraphName(c.getConstant("HOME_URI"), mapUri);
			var baseUri = c.getConstant("HOME_URI");
			var prefix = c.getConstant("PREFIXES");
			var insertTemplate = c.getConstant("QUERY_INSERT");
			var tripleSeparator = " . ";// + String.fromCharCode(13);
			var paperMapUri = "<" + mapUri + "> ";
			
			var paperMapPlacesArray = csv2array(mapPlaces);//Get the list of user's places as an array
			
			//Triples for map
			var cMapTriples = "";
			// paper map
			cMapTriples = paperMapUri + "a <http://www.geographicknowledge.de/vocab/maps#Map>" + tripleSeparator;
			cMapTriples += paperMapUri + "<http://www.geographicknowledge.de/vocab/maps#medium> <http://www.geographicknowledge.de/vocab/maps#Paper>" + tripleSeparator;
			// Relation paper - image
			cMapTriples += paperMapUri + "<http://www.geographicknowledge.de/vocab/maps#digitalImageVersion> <" + imageUrl + ">" + tripleSeparator;
			//Size
			if(mapSize != null && mapSize.length > 0){
				cMapTriples += paperMapUri + "<http://www.geographicknowledge.de/vocab/maps#mapSize> '" + mapSize + "'^^xsd:string" + tripleSeparator;
			}
			//paper map title
			if(mapTitle != null && mapTitle.length > 0){
				cMapTriples += paperMapUri + "<http://www.geographicknowledge.de/vocab/maps#title> '" + mapTitle + "'^^xsd:string" + tripleSeparator;
			}
			
			//paper map time
			if(mapTime != null && mapTime.length > 0){
				var dateArray = mapTime.split("-");
				var dateFrom = "";
				var dateTo = "";
				var tripleFrom = "";
				var tripleTo = "";
				var timeTriple = "";

				if(dateArray.length > 0){
					if(dateArray.length == 1){
						dateFrom = dateArray[0];
						dateFrom = dateFrom.trim();
						tripleFrom = "<" + mapUri + "/mapRepresentationTime> a <http://www.w3.org/2006/time#Instant>" + tripleSeparator;
						tripleFrom += "<" + mapUri + "/mapRepresentationTime> <http://www.w3.org/2001/XMLSchema#gYear> '" + dateFrom + "'" + tripleSeparator;
						timeTriple = tripleFrom;
					}else if(dateArray.length == 2){
						dateFrom = dateArray[0];
						dateFrom = dateFrom.trim();
						dateTo = dateArray[1];
						dateTo = dateTo.trim();
						tripleFrom = "<" + mapUri + "/mapRepresentationTime/start> a <http://www.w3.org/2006/time#Instant>" + tripleSeparator;
						tripleFrom += "<" + mapUri + "/mapRepresentationTime/start> <http://www.w3.org/2001/XMLSchema#gYear> '" + dateFrom + "'" + tripleSeparator;
						tripleTo = "<" + mapUri + "/mapRepresentationTime/end> a <http://www.w3.org/2006/time#Instant>" + tripleSeparator;
						tripleTo += "<" + mapUri + "/mapRepresentationTime/end> <http://www.w3.org/2001/XMLSchema#gYear> '" + dateTo + "'" + tripleSeparator;
						var intervalTriple = "<" + mapUri + "/mapRepresentationTime> a <http://www.w3.org/2006/time#Interval>" + tripleSeparator;
						intervalTriple +=  "<" + mapUri + "/mapRepresentationTime> <http://www.w3.org/2006/time#hasBeginning> <" + mapUri + "/mapRepresentationTime/start>" + tripleSeparator;
						intervalTriple +=  "<" + mapUri + "/mapRepresentationTime> <http://www.w3.org/2006/time#hasEnd> <" + mapUri + "/mapRepresentationTime/end>" + tripleSeparator;
						timeTriple	=  intervalTriple + tripleFrom + tripleTo;
					}
					cMapTriples += paperMapUri + "<http://www.geographicknowledge.de/vocab/maps#mapsTime> <" + mapUri + "/mapRepresentationTime>" + tripleSeparator;
					cMapTriples += timeTriple;
				}
			}
			
			//paper map scale
			if(mapScale != null && mapScale.length > 0){
				cMapTriples += paperMapUri + "<http://www.geographicknowledge.de/vocab/maps#hasScale> '" + mapScale + "'^^xsd:string" +  tripleSeparator;
			}
			//paper map area en map coords
			if(mapArea != null && mapArea.length > 0){
				//Get a name for the Geometry object (map area)
				var geomName = imageUrl + "/" + djb2Code(imageUrl);
				cMapTriples += "<" + geomName + "> a geo:Geometry " +  tripleSeparator;
				cMapTriples += paperMapUri + "<http://www.geographicknowledge.de/vocab/maps#mapsArea> " + "<" + geomName + "> " +  tripleSeparator;
				cMapTriples += "<" + geomName + "> geo:asWKT '" + mapArea + "'^^sf:wktLiteral" +  tripleSeparator;
			}
			//paper map description
			if(mapDescription != null && mapDescription.length > 0){
				var tmpDescription = mapDescription.replace("'",'\"');
				cMapTriples += paperMapUri + "<http://purl.org/dc/terms/description> '" + mapDescription + "'^^xsd:string" +  tripleSeparator;
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
			if(mapCreator != null && mapCreator.length > 0){
				if(isUrl(mapCreator)){
					cAgentTriples = paperMapUri + " <http://purl.org/dc/terms/creator> <" + mapCreator + ">" + tripleSeparator;
				}else{
					var tmpMapCreator =  encodeURI(baseUri + "/" + mapCreator);
					cAgentTriples = paperMapUri + " <http://purl.org/dc/terms/creator> <" + tmpMapCreator + ">" + tripleSeparator;
					cAgentTriples += "<" + tmpMapCreator + "> a <http://purl.org/dc/terms/Agent>" + tripleSeparator;
					cAgentTriples += "<" + tmpMapCreator + "> foaf:name '" + mapCreator + "'^^xsd:string" + tripleSeparator;
				}
			}

			
			//-----------------------------------
			//Builds triples form the checkboxes
			//-----------------------------------
			
			
			//DBpedia places matched from user's places. Alphanumeric
			for (var i = 0; i < mapLinksPlaces.length; i++) {
				cMapTriples += paperMapUri + "<http://www.geographicknowledge.de/vocab/maps#mapsPhenomenon> <" +  mapLinksPlaces[i] + ">" + tripleSeparator;
			}

			//DBpedia retrieved from the image map boundary and the user's typed year- spatio temporal places
			for (var i = 0; i < mapLinksTags.length; i++) {
				cMapTriples += paperMapUri + "<http://www.geographicknowledge.de/vocab/maps#mapsPhenomenon> <" + mapLinksTags[i] + ">" + tripleSeparator;
			}

			//DBpedia - Links found in the user's description
			for (var i = 0; i < mapLinksDescription.length; i++) {
				cMapTriples += paperMapUri + "<http://purl.org/dc/terms/references> <" +  mapLinksDescription[i] + ">" + tripleSeparator;
			}
					
			//Triples from the ontology
			for (var i = 0; i < mapLinksContents.length; i++) {
				var tmpInstance = djb2Code(mapUri + "/" + mapLinksContents[i]);
				cMapTriples += paperMapUri + " a <" + mapLinksContents[i]  + ">" + tripleSeparator;
				cMapTriples += paperMapUri + "<http://www.geographicknowledge.de/vocab/maps#mapsPhenomenon> _:" +  tmpInstance + tripleSeparator;
			}
			
			//Replace in the insert template
			insertTemplate = insertTemplate.replace("PARAM_GRAPH", graph);
			insertTemplate = insertTemplate.replace("PARAM_TRIPLES", cMapTriples + cPlaceTriples + cAgentTriples);
			var queryInsert = prefix + " " + insertTemplate;
			//queryInsert = queryInsert.replace(/(\r\n|\n|\r)/gm,"");//Removes \r
			res = queryInsert;

			return res;
		};

		
		return {
			getImageUrl: getImageUrl,
			getMapUri: getMapUri,
			getMapTitle: getMapTitle,
			getMapCreator: getMapCreator,
			getMapSize: getMapSize,
			getMapTime: getMapTime,
			getMapScale: getMapScale,
			getMapArea: getMapArea,
			getMapPlaces: getMapPlaces,
			getMapLinks: getMapLinks,
			getMapDescription: getMapDescription,
			getMapLinksContents: getMapLinksContents,
			getMapLinksPlaces: getMapLinksPlaces,
			getMapLinksTags: getMapLinksTags,
			getMapLinksDescription: getMapLinksDescription,
			setImageUrl: setImageUrl,
			setMapUri: setMapUri,
			setMapTitle: setMapTitle,
			setMapCreator: setMapCreator,
			setMapSize: setMapSize,
			setMapTime: setMapTime,
			setMapScale: setMapScale,
			setMapArea: setMapArea,
			setMapPlaces: setMapPlaces,
			setMapLinks: setMapLinks,
			setMapDescription: setMapDescription,
			setMapLinksContents: setMapLinksContents,
			setMapLinksPlaces: setMapLinksPlaces,
			setMapLinksTags: setMapLinksTags,
			setMapLinksDescription: setMapLinksDescription,
			buildTriples: buildTriples
		};
	};
	
	
	
	return {
		getInstance: function(){
			if(!mapDescriptionInstance){
				mapDescriptionInstance = createMapDescription();
			}
			return mapDescriptionInstance;
		}
	};

})();
