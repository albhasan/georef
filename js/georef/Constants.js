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
	
	var PREFIXES =	'PREFIX owl: <http://www.w3.org/2002/07/owl#> ' + 
					'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> ' + 
					'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> ' + 
					'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ' + 
					'PREFIX foaf: <http://xmlns.com/foaf/0.1/> ' + 
					'PREFIX dc: <http://purl.org/dc/elements/1.1/> ' + 
					'PREFIX : <http://dbpedia.org/resource/> ' + 
					'PREFIX dbpedia2: <http://dbpedia.org/property/> ' + 
					'PREFIX dbpedia: <http://dbpedia.org/> ' + 
					'PREFIX skos: <http://www.w3.org/2004/02/skos/core#> ';
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
		}
		return res;
	}

}