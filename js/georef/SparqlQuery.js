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



}