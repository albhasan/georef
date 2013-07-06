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
	var DBPEDIA_SPARQL = 'http://dbpedia.org/sparql';
	
	var HOME_URI = 'http://uni-muenster.de/historicmaps/';
	
	var HOME_GRAPH = 'http://ifgi.uni-muenster.de/historicmaps/';
	
	var HOME_SPARQLENDPOINT = 'http://giv-siidemo.uni-muenster.de:8081/parliament/sparql';
	
	var PREFIXES =	'PREFIX owl: <http://www.w3.org/2002/07/owl#> ' + String.fromCharCode(13) +
					'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> ' + String.fromCharCode(13) +
					'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> ' + String.fromCharCode(13) +
					'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ' + String.fromCharCode(13) +
					'PREFIX foaf: <http://xmlns.com/foaf/0.1/> ' + String.fromCharCode(13) +
					'PREFIX dc: <http://purl.org/dc/elements/1.1/> ' + String.fromCharCode(13) +
					'PREFIX : <http://dbpedia.org/resource/> ' + String.fromCharCode(13) +
					'PREFIX dbpedia2: <http://dbpedia.org/property/> ' + String.fromCharCode(13) +
					'PREFIX dbpedia: <http://dbpedia.org/> ' + String.fromCharCode(13) +
					'PREFIX skos: <http://www.w3.org/2004/02/skos/core#> ' + String.fromCharCode(13) +
					'PREFIX sf: <http://www.opengis.net/ont/sf#> ' + String.fromCharCode(13) +
					'PREFIX geof: <http://www.opengis.net/def/function/geosparql/> ' + String.fromCharCode(13) +
					'PREFIX geo: <http://www.opengis.net/ont/geosparql#> ' + String.fromCharCode(13) +
					'PREFIX geoWgs84: <http://www.w3.org/2003/01/geo/wgs84_pos#> ' + String.fromCharCode(13);
					
	var QUERY_INSERT = 	'#************************************************************************' + String.fromCharCode(13) +
						'# YOU CAN USE THIS SPARQL QUERY TO INSERT MAP METADATA IN A TRIPLE STORE' + String.fromCharCode(13) +
						'#************************************************************************' + String.fromCharCode(13) +
						'INSERT DATA{' + String.fromCharCode(13) + String.fromCharCode(13) +
						'	GRAPH<PARAM_GRAPH>{' + String.fromCharCode(13) + String.fromCharCode(13) +
						'	PARAM_TRIPLES' + String.fromCharCode(13) + String.fromCharCode(13) +
						'	}' + String.fromCharCode(13) +
						'}' + String.fromCharCode(13);
	
	var QUERY_CITYS = 	'SELECT ?subject ?label (AVG(?lat) AS ?lt) (AVG(?long) AS ?lg) ' + String.fromCharCode(13) +
						'WHERE { ' + String.fromCharCode(13) +
						'	?subject rdfs:label ?label. ' + String.fromCharCode(13) +
						'	?subject geoWgs84:lat ?lat.  ' + String.fromCharCode(13) +
						'	?subject geoWgs84:long ?long.  ' + String.fromCharCode(13) +
						'	?subject <http://dbpedia.org/ontology/populationUrban> ?population.  ' + String.fromCharCode(13) +
						'	{ ' + String.fromCharCode(13) +
						'		SELECT DISTINCT ?subject ' + String.fromCharCode(13) +
						'		WHERE {  ' + String.fromCharCode(13) +
						'			?subject rdf:type <http://dbpedia.org/ontology/City>.  ' + String.fromCharCode(13) +
						'			?subject <http://dbpedia.org/ontology/populationUrban> ?population.  ' + String.fromCharCode(13) +
						'			?subject geoWgs84:lat ?lat.  ' + String.fromCharCode(13) +
						'			?subject geoWgs84:long ?long.  ' + String.fromCharCode(13) +
						'			FILTER (  ' + String.fromCharCode(13) +
						'				xsd:double(?lat) >= <PARAM_YMIN> &&  ' + String.fromCharCode(13) +
						'				xsd:double(?lat) <= <PARAM_YMAX> &&  ' + String.fromCharCode(13) +
						'				xsd:double(?long) >= <PARAM_XMIN> &&  ' + String.fromCharCode(13) +
						'				xsd:double(?long) <= <PARAM_XMAX> ' + String.fromCharCode(13) +
						'			)  ' + String.fromCharCode(13) +
						'		} ' + String.fromCharCode(13) +
						'		ORDER BY DESC(xsd:integer(?population))  ' + String.fromCharCode(13) +
						'		LIMIT 10  ' + String.fromCharCode(13) +
						'	} ' + String.fromCharCode(13) +
						'	FILTER (  ' + String.fromCharCode(13) +
						'		lang(?label) = "en" ' + String.fromCharCode(13) +
						'	) ' + String.fromCharCode(13) +
						'}ORDER BY DESC(xsd:integer(?population)) ';

	var KML_OVERLAY = 	'<?xml version="1.0" encoding="UTF-8"?> ' + String.fromCharCode(13) +
						'<!-- ' + String.fromCharCode(13) +
						'******************************************************************' + String.fromCharCode(13) +
						'PLEASE SAVE THIS TEXT AS KML (*.kml) AND OPEN IT WITH GOOGLE EARTH' + String.fromCharCode(13) +
						'******************************************************************' + String.fromCharCode(13) +
						'--> ' + String.fromCharCode(13) +
						'<kml xmlns="http://www.opengis.net/kml/2.2"> ' + String.fromCharCode(13) +
						'	<Folder> ' + String.fromCharCode(13) +
						'		<name>Ground Overlays</name> ' + String.fromCharCode(13) +
						'		<description>Map image overlay</description> ' + String.fromCharCode(13) +
						'		<GroundOverlay> ' + String.fromCharCode(13) +
						'			<name>Map image overlay on terrain</name> ' + String.fromCharCode(13) +
						'			<description>This is an image of a georeferenced historic map.</description> ' + String.fromCharCode(13) +
						'			<Icon> ' + String.fromCharCode(13) +
						'				<href><PARAM_URL></href> ' + String.fromCharCode(13) +
						'			</Icon> ' + String.fromCharCode(13) +
						'			<LatLonBox> ' + String.fromCharCode(13) +
						'				<north><PARAM_NORTH></north> ' + String.fromCharCode(13) +
						'				<south><PARAM_SOUTH></south> ' + String.fromCharCode(13) +
						'				<east><PARAM_EAST></east> ' + String.fromCharCode(13) +
						'				<west><PARAM_WEST></west> ' + String.fromCharCode(13) +
						'				<rotation><PARAM_ROTATION></rotation> ' + String.fromCharCode(13) +
						'			</LatLonBox> ' + String.fromCharCode(13) +
						'		</GroundOverlay> ' + String.fromCharCode(13) +
						'	</Folder> ' + String.fromCharCode(13) +
						'</kml>';

				
	var CODE_WINDOW_HTML_PREFIX = '<html><head><title>KML</title></head><body><textarea rows="27" cols="400">';
	var CODE_WINDOW_HTML_SUFIX = '</textarea></body></html>'; 
	var CODE_WINDOW_PROPERTIES = 'www.ulb.uni-muenster.de","_blank","toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=600, height=400';
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
		}
		
		return res;
	}

}