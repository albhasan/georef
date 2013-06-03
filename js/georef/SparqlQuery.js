/*
Copyright © 2000 Alber Sanchez <albhasan@gmail.com>
This work is free. You can redistribute it and/or modify it under the
terms of the Do What The Fuck You Want To Public License, Version 2,
as published by Sam Hocevar. See the COPYING file for more details.
*/
function SparqlQuery(){

	var queryCapitols = "Query for capitols";
	var queryCities = "Query for cities";
	var queryMonuments = "query for monuments";

	//---------------------------------------------------------
	//PRIVATE
	//---------------------------------------------------------
	function sendSparqlQuery(query, baseURL, defGraphUri) {
		var format = "application/json";
		var debug = "on";
		var timeout = 0;
		var params={
			"default-graph-uri": defGraphUri, "should-sponge": "soft", "query": query,
			"debug": debug, "timeout": timeout, "format": format,
			"save": "display", "fname": ""
		};
		
		var querypart="";
		for(var k in params) {
			querypart+=k+"="+encodeURIComponent(params[k])+"&";
		}
		var queryURL=baseURL + '?' + querypart;
		if (window.XMLHttpRequest) {
		xmlhttp=new XMLHttpRequest();
	  }
	  else {
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	  }

	  xmlhttp.open("GET",queryURL,false);
	  xmlhttp.send();
	  return JSON.parse(xmlhttp.responseText);
	}
	//---------------------------------------------------------
	//PRIVILEGED
	//---------------------------------------------------------

/*
var dsn="http://dbpedia.org/resource/DBpedia";


Virtuoso pragma "DEFINE get:soft "replace" instructs Virtuoso SPARQL engine to perform an HTTP GET using the IRI in FROM clause as Data Source URL with regards to 
DBMS record inserts


var query="SELECT DISTINCT * FROM <"+dsn+"> WHERE {?s ?p ?o} LIMIT 10"; 
var defGraphUri = "http://dbpedia.org";
var endpointUrl = "http://DBpedia.org/sparql";
var data = sparqlQuery(query, endpointUrl, defGraphUri);
document.write(recurse( data ));











function recurse( data ) {
  var htmlRetStr = "<ul class='recurseObj' >"; 
  for (var key in data) {
        if (typeof(data[key])== 'object' && data[key] != null) {
            htmlRetStr += "<li class='keyObj' ><strong>" + key + ":</strong><ul class='recurseSubObj' >";
            htmlRetStr += recurse( data[key] );
            htmlRetStr += '</ul  ></li   >';
        } else {
            htmlRetStr += ("<li class='keyStr' ><strong>" + key + ': </strong>&quot;' + data[key] + '&quot;</li  >' );
        }
  };
  htmlRetStr += '</ul >';    
  return( htmlRetStr );
}
*/

}