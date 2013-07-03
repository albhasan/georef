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
	
	var PREFIXES =	'PREFIX owl: <http://www.w3.org/2002/07/owl#> ' + 
					'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> ' + 
					'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> ' + 
					'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ' + 
					'PREFIX foaf: <http://xmlns.com/foaf/0.1/> ' + 
					'PREFIX dc: <http://purl.org/dc/elements/1.1/> ' + 
					'PREFIX : <http://dbpedia.org/resource/> ' + 
					'PREFIX dbpedia2: <http://dbpedia.org/property/> ' + 
					'PREFIX dbpedia: <http://dbpedia.org/> ' + 
					'PREFIX skos: <http://www.w3.org/2004/02/skos/core#> ' + 
					'PREFIX sf: <http://www.opengis.net/ont/sf#>' + 
					'PREFIX geof: <http://www.opengis.net/def/function/geosparql/>' + 
					'PREFIX geo: <http://www.opengis.net/ont/geosparql#>';
					
	var QUERY_INSERT = 	'INSERT DATA{' + 
						'GRAPH<PARAM_GRAPH>{' + 
						'PARAM_TRIPLES' + 
						'}}';
	
	var QUERY_CITYS = 	'SELECT ?subject ?label (AVG(?lat) AS ?lt) (AVG(?long) AS ?lg) ' + 
						'WHERE { ' + 
						'	?subject rdfs:label ?label. ' + 
						'	?subject geo:lat ?lat.  ' + 
						'	?subject geo:long ?long.  ' + 
						'	?subject <http://dbpedia.org/ontology/populationUrban> ?population.  ' + 
						'	{ ' + 
						'		SELECT DISTINCT ?subject ' + 
						'		WHERE {  ' + 
						'			?subject rdf:type <http://dbpedia.org/ontology/City>.  ' + 
						'			?subject <http://dbpedia.org/ontology/populationUrban> ?population.  ' + 
						'			?subject geo:lat ?lat.  ' + 
						'			?subject geo:long ?long.  ' + 
						'			FILTER (  ' + 
						'				xsd:double(?lat) >= <PARAM_YMIN> &&  ' + 
						'				xsd:double(?lat) <= <PARAM_YMAX> &&  ' + 
						'				xsd:double(?long) >= <PARAM_XMIN> &&  ' + 
						'				xsd:double(?long) <= <PARAM_XMAX> ' + 
						'			)  ' + 
						'		} ' + 
						'		ORDER BY DESC(xsd:integer(?population))  ' + 
						'		LIMIT 10  ' + 
						'	} ' + 
						'	FILTER (  ' + 
						'		lang(?label) = "en" ' + 
						'	) ' + 
						'}ORDER BY DESC(xsd:integer(?population))  ';

	var KML_OVERLAY = 	'<html><head><title>KML</title></head><body><textarea rows="27" cols="400">' +
						'<?xml version="1.0" encoding="UTF-8"?> ' + String.fromCharCode(13) +
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
						'</kml>' + 
						'</textarea></body></html>'; 


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
		}
		
		return res;
	}

}