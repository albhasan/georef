/*
Copyright © 2000 Alber Sanchez <albhasan@gmail.com>
This work is free. You can redistribute it and/or modify it under the
terms of the Do What The Fuck You Want To Public License, Version 2,
as published by Sam Hocevar. See the COPYING file for more details.
*/
function Constants(){
	var that = this;
	//---------------------------------------------------------
	//PRIVATE
	//---------------------------------------------------------
	var newline = " ";
	
	var DBPEDIA_SPARQL = 'http://dbpedia.org/sparql';
	
	var HOME_URI = 'http://uni-muenster.de/historicmaps/';
	
	var HOME_GRAPH = 'http://ifgi.uni-muenster.de/historicmaps/';
	
	var HOME_SPARQLENDPOINT = 'http://giv-siidemo.uni-muenster.de:8081/parliament/sparql';
	
	var PREFIXES =	'PREFIX owl: <http://www.w3.org/2002/07/owl#> ' + newline +
					'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> ' + newline +
					'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> ' + newline +
					'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ' + newline +
					'PREFIX foaf: <http://xmlns.com/foaf/0.1/> ' + newline +
					'PREFIX dc: <http://purl.org/dc/elements/1.1/> ' + newline +
					'PREFIX : <http://dbpedia.org/resource/> ' + newline +
					'PREFIX dbpedia2: <http://dbpedia.org/property/> ' + newline +
					'PREFIX dbpedia: <http://dbpedia.org/> ' + newline +
					'PREFIX dbpedia-owl: <http://dbpedia.org/ontology/> ' + newline +
					'PREFIX skos: <http://www.w3.org/2004/02/skos/core#> ' + newline +
					'PREFIX sf: <http://www.opengis.net/ont/sf#> ' + newline +
					'PREFIX geof: <http://www.opengis.net/def/function/geosparql/> ' + newline +
					'PREFIX geo: <http://www.opengis.net/ont/geosparql#> ' + newline +
					'PREFIX geoWgs84: <http://www.w3.org/2003/01/geo/wgs84_pos#> ' + newline;
					
	var QUERY_INSERT = 	'#************************************************************************' + newline +
						'# YOU CAN USE THIS SPARQL QUERY TO INSERT MAP METADATA IN A TRIPLE STORE' + newline +
						'#************************************************************************' + newline +
						'INSERT DATA{' + newline + 
						'	GRAPH<PARAM_GRAPH>{' + newline + 
						'	PARAM_TRIPLES' + newline + 
						'	}' + newline +
						'}' + newline;
	
	var QUERY_CITYS = 	'SELECT ?subject ?label (AVG(?lat) AS ?lt) (AVG(?long) AS ?lg) ' + newline +
						'WHERE { ' + newline +
						'	?subject rdfs:label ?label. ' + newline +
						'	?subject geoWgs84:lat ?lat.  ' + newline +
						'	?subject geoWgs84:long ?long.  ' + newline +
						'	?subject <http://dbpedia.org/ontology/populationUrban> ?population.  ' + newline +
						'	{ ' + newline +
						'		SELECT DISTINCT ?subject ' + newline +
						'		WHERE {  ' + newline +
						'			?subject rdf:type <http://dbpedia.org/ontology/City>.  ' + newline +
						'			?subject <http://dbpedia.org/ontology/populationUrban> ?population.  ' + newline +
						'			?subject geoWgs84:lat ?lat.  ' + newline +
						'			?subject geoWgs84:long ?long.  ' + newline +
						'			FILTER (  ' + newline +
						'				xsd:double(?lat) >= <PARAM_YMIN> &&  ' + newline +
						'				xsd:double(?lat) <= <PARAM_YMAX> &&  ' + newline +
						'				xsd:double(?long) >= <PARAM_XMIN> &&  ' + newline +
						'				xsd:double(?long) <= <PARAM_XMAX> ' + newline +
						'			)  ' + newline +
						'		} ' + newline +
						'		ORDER BY DESC(xsd:integer(?population))  ' + newline +
						'		LIMIT 10  ' + newline +
						'	} ' + newline +
						'	FILTER (  ' + newline +
						'		lang(?label) = "en" ' + newline +
						'	) ' + newline +
						'}ORDER BY DESC(xsd:integer(?population)) ';
						
	var QUERY_COMPLETE_SUBJECT = 	'SELECT ?subject ?label ?abst ' + newline + 
									'WHERE { ' + newline +
										'?subject rdfs:label ?label . ' + newline +
										'?subject dbpedia-owl:abstract ?abst . ' + newline +
										'FILTER( ' + newline +
										'	str(?subject) = "<PARAM_URI>" && ' + newline +
										'	lang(?label) = "en" && ' + newline +
										'	lang(?abst) = "en" ' + newline +
										') ' + newline +
									'} LIMIT 1' + newline;
						
	var QUERY_BOX_YEAR = 	'SELECT ?subject ?label ?abst ' + newline +
							'WHERE { ' + newline +
							'	?subject rdfs:label ?label . ' + newline +
							'	?subject dbpedia-owl:abstract ?abst . ' + newline +
							'	{ ' + newline +
							'		SELECT DISTINCT ?subject ' + newline +
							'		WHERE { ' + newline +
							'			?subject geoWgs84:lat ?lat. ' + newline +
							'			?subject geoWgs84:long ?long. ' + newline +
							'			?subject dbpedia-owl:foundingYear ?start . ' + newline +
							'			?subject dbpedia-owl:dissolutionYear ?end . ' + newline +
							'			FILTER( ' + newline +
							'				xsd:double(?lat) >= <PARAM_YMIN> && ' + newline +
							'				xsd:double(?lat) <= <PARAM_YMAX> && ' + newline +
							'				xsd:double(?long) >= <PARAM_XMIN> && ' + newline +
							'				xsd:double(?long) <= <PARAM_XMAX> && ' + newline +
							'				?start < "<PARAM_YEAR>"^^xsd:gYear && ' + newline +
							'				?end > "<PARAM_YEAR>"^^xsd:gYear ' + newline +
							'			). ' + newline +
							'		}LIMIT 10 ' + newline +
							'	} ' + newline +
							'	FILTER( ' + newline +
							'		lang(?label) = "en"	&& ' + newline +
							'		lang(?abst) = "en" ' + newline +
							'	) ' + newline +
							'}' + newline;					
						
	var KML_OVERLAY = 	'<?xml version="1.0" encoding="UTF-8"?> ' + newline +
						'<!-- ' + newline +
						'******************************************************************' + newline +
						'PLEASE SAVE THIS TEXT AS KML (*.kml) AND OPEN IT WITH GOOGLE EARTH' + newline +
						'******************************************************************' + newline +
						'--> ' + newline +
						'<kml xmlns="http://www.opengis.net/kml/2.2"> ' + newline +
						'	<Folder> ' + newline +
						'		<name>Ground Overlays</name> ' + newline +
						'		<description>Map image overlay</description> ' + newline +
						'		<GroundOverlay> ' + newline +
						'			<name>Map image overlay on terrain</name> ' + newline +
						'			<description>This is an image of a georeferenced historic map.</description> ' + newline +
						'			<Icon> ' + newline +
						'				<href><PARAM_URL></href> ' + newline +
						'			</Icon> ' + newline +
						'			<LatLonBox> ' + newline +
						'				<north><PARAM_NORTH></north> ' + newline +
						'				<south><PARAM_SOUTH></south> ' + newline +
						'				<east><PARAM_EAST></east> ' + newline +
						'				<west><PARAM_WEST></west> ' + newline +
						'				<rotation><PARAM_ROTATION></rotation> ' + newline +
						'			</LatLonBox> ' + newline +
						'		</GroundOverlay> ' + newline +
						'	</Folder> ' + newline +
						'</kml>' + newline;

				
	var CODE_WINDOW_HTML_PREFIX = '<html><head><title><PARAM_WINDOW_TITLE></title></head><body><textarea rows="27" cols="400">';
	var CODE_WINDOW_HTML_SUFIX = '</textarea></body></html>'; 
	var CODE_WINDOW_PROPERTIES = 'www.ulb.uni-muenster.de","_blank","toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=600, height=400';
	
	var ABSTRACT_LENGTH = '197';

	
	
	var IMAGE_BOUNDARY_POLYGON = {
				"stroke" : false, 
				"fill" : true, 
				"fillColor" : "#03f",
				"fillOpacity" : 0.2,
				"clickable" : false
			}
	
	var MAP_AREA_POLYGON = {
					"stroke" : true, 
					"fill" : false, 
					"fillColor" : "#03f",
					"fillOpacity" : 0.2,
					"clickable" : false
				}
	

	
	//---------------------------------------------------------
	//PRIVILEGED
	//---------------------------------------------------------
	this.getConstant = function(name){
		var res;
		if(name == "PREFIXES"){
			res = PREFIXES;
		}else if(name == "QUERY_CITYS"){
			res = QUERY_CITYS;
		}else if(name =="DBPEDIA_SPARQL"){
			res = DBPEDIA_SPARQL;
		}else if(name =="KML_OVERLAY"){
			res = KML_OVERLAY;
		}else if(name =="HOME_URI"){
			res = HOME_URI;
		}else if(name =="QUERY_INSERT"){
			res = QUERY_INSERT;
		}else if(name =="HOME_GRAPH"){
			res = HOME_GRAPH;
		}else if(name =="HOME_SPARQLENDPOINT"){
			res = HOME_SPARQLENDPOINT;
		}else if(name =="CODE_WINDOW_PROPERTIES"){
			res = CODE_WINDOW_PROPERTIES;
		}else if(name =="CODE_WINDOW_HTML_PREFIX"){
			res = CODE_WINDOW_HTML_PREFIX;
		}else if(name =="CODE_WINDOW_HTML_SUFIX"){
			res = CODE_WINDOW_HTML_SUFIX;
		}else if(name =="IMAGE_BOUNDARY_POLYGON"){
			res = IMAGE_BOUNDARY_POLYGON;
		}else if(name =="MAP_AREA_POLYGON"){
			res = MAP_AREA_POLYGON;
		}else if(name =="QUERY_BOX_YEAR"){
			res = QUERY_BOX_YEAR;
		}else if(name =="QUERY_COMPLETE_SUBJECT"){
			res = QUERY_COMPLETE_SUBJECT;
		}else if(name =="ABSTRACT_LENGTH"){
			res = ABSTRACT_LENGTH;
		}
		
		
		
		return res;
	}

}