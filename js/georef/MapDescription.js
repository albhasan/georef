var MapDescription = (function(){

	var mapDescriptionInstance; //private variable to hold the only instance
	
	var createMapDescription = function(){


		var that = this;
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
			var tripleSeparator = " . \n";// + String.fromCharCode(13);
			var paperMapUri = "<" + mapUri + "> ";
			
			var paperMapPlacesArray = csv2array(getMapPlaces());//Get the list of user's places as an array
			
			//Triples for map
			var cMapTriples = "";
			// paper map
			cMapTriples = paperMapUri + "a <http://www.geographicknowledge.de/vocab/maps#Map>" + tripleSeparator;
			cMapTriples += paperMapUri + "<http://www.geographicknowledge.de/vocab/maps#medium> <http://www.geographicknowledge.de/vocab/maps#Paper>" + tripleSeparator;
			// Relation paper - image
			cMapTriples += paperMapUri + "<http://www.geographicknowledge.de/vocab/maps#digitalImageVersion> <" + imageUrl + ">" + tripleSeparator;
			//Size
			if(getMapSize() != null && getMapSize().length > 0){
				cMapTriples += paperMapUri + "<http://www.geographicknowledge.de/vocab/maps#mapSize> '" + getMapSize() + "'^^xsd:string" + tripleSeparator;
			}
			//paper map title
			if(getMapTitle() != null && getMapTitle().length > 0){
				cMapTriples += paperMapUri + "<http://www.geographicknowledge.de/vocab/maps#title> '" + getMapTitle() + "'^^xsd:string" + tripleSeparator;
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
			if(this.getMapScale() != null && this.getMapScale().length > 0){
				cMapTriples += paperMapUri + "<http://www.geographicknowledge.de/vocab/maps#hasScale> '" + getMapScale() + "'^^xsd:string" +  tripleSeparator;
			}
			//paper map area en map coords
			if(this.getMapArea() != null && this.getMapArea().length > 0){
				//Get a name for the Geometry object (map area)
				var geomName = imageUrl + "/" + djb2Code(imageUrl);
				cMapTriples += "<" + geomName + "> a geo:Geometry " +  tripleSeparator;
				cMapTriples += paperMapUri + "<http://www.geographicknowledge.de/vocab/maps#mapsArea> " + "<" + geomName + "> " +  tripleSeparator;
				cMapTriples += "<" + geomName + "> geo:asWKT '" + this.getMapArea() + "'^^sf:wktLiteral" +  tripleSeparator;
			}
			//paper map description
			if(this.getMapDescription() != null && this.getMapDescription().length > 0){
				var tmpDescription = this.getMapDescription().replace("'",'\"');
				cMapTriples += paperMapUri + "<http://purl.org/dc/terms/description> '" + this.getMapDescription() + "'^^xsd:string" +  tripleSeparator;
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
			if(this.getMapCreator() != null && this.getMapCreator().length > 0){
				if(isUrl(this.getMapCreator())){
					cAgentTriples = paperMapUri + " <http://purl.org/dc/terms/creator> <" + this.getMapCreator() + ">" + tripleSeparator;
				}else{
					var tmpMapCreator =  encodeURI(baseUri + "/" + this.getMapCreator());
					cAgentTriples = paperMapUri + " <http://purl.org/dc/terms/creator> <" + tmpMapCreator + ">" + tripleSeparator;
					cAgentTriples += "<" + tmpMapCreator + "> a <http://purl.org/dc/terms/Agent>" + tripleSeparator;
					cAgentTriples += "<" + tmpMapCreator + "> foaf:name '" + this.getMapCreator() + "'^^xsd:string" + tripleSeparator;
				}
			}

			
			//-----------------------------------
			//Builds triples form the checkboxes
			//-----------------------------------
			
			cMapTriples += "\n\n#############DBPEDIA triples#############\n";
			
			//DBpedia places matched from user's places. Alphanumeric
			
			
			if(getMapLinksPlaces() != null){
				for (var i = 0; i < getMapLinksPlaces().length; i++) {
					cMapTriples += paperMapUri + "<http://www.geographicknowledge.de/vocab/maps#mapsPhenomenon> <" +  getMapLinksPlaces()[i] + ">" + tripleSeparator;
				}
			}

			//DBpedia retrieved from the image map boundary and the user's typed year- spatio temporal places
			
			if(getMapLinksTags() != null){
				for (var i = 0; i < getMapLinksTags().length; i++) {
					cMapTriples += paperMapUri + "<http://www.geographicknowledge.de/vocab/maps#mapsPhenomenon> <" + getMapLinksTags()[i] + ">" + tripleSeparator;
				}
			}

			//DBpedia - Links found in the user's description
			if(getMapLinksDescription() != null){
				for (var i = 0; i < getMapLinksDescription().length; i++) {
					cMapTriples += paperMapUri + "<http://purl.org/dc/terms/references> <" +  getMapLinksDescription()[i] + ">" + tripleSeparator;
				}
			}

			//Triples from the ontology
			if(getMapLinksContents() != null){
			for (var i = 0; i < getMapLinksContents().length; i++) {
				var tmpInstance = djb2Code(mapUri + "/" + getMapLinksContents()[i]);
				cMapTriples += "_:" +  tmpInstance + " a <" + getMapLinksContents()[i]  + ">" + tripleSeparator;
				cMapTriples += paperMapUri + "<http://www.geographicknowledge.de/vocab/maps#mapsPhenomenon> _:" +  tmpInstance + tripleSeparator;
			}
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
