function AffineTransformation(xyArraySource, xyArrayDestination){

	var that = this;
	var c = new Coords();
	var xyArrayFrom;
	var xyArrayTo;
	var parameters;

	if(xyArraySource.length == xyArrayDestination.length && xyArraySource.length > 2){//at least 3 points
		xyArrayFrom = xyArraySource;
		xyArrayTo  = xyArrayDestination;
		parameters = calculateParameters(xyArrayFrom, xyArrayTo);
	}
	
	//---------------------------------------------------------
	//PRIVATE
	//---------------------------------------------------------
	
	//https://groups.google.com/forum/?fromgroups#!topic/mapinfo-l/au0j3pSLXHM
	function buildMatrix(xyArray){
		var res = new Array();
		for(var i = 0; i < xyArray.length; i++){
			var tmp = new Array();
			var xy = xyArray[i];
			var x = xy[0];
			var y = xy[1];
			tmp.push(x);
			tmp.push(y);
			tmp.push(1);
			res.push(tmp);
		}
		return res;
	}
	
	//https://groups.google.com/forum/?fromgroups#!topic/mapinfo-l/au0j3pSLXHM
	function calculateParameters(xyArrayFrom, xyArrayTo){
		var res = new Array();
		var Aarray = buildMatrix(xyArrayFrom);
		var Barray = buildMatrix(xyArrayTo);
		res = c.perspectivity(Aarray, Barray);
		res  = trasposeArray(res);
		return res;
	}

	//---------------------------------------------------------
	//PRIVILEGED
	//---------------------------------------------------------
	this.getXyArraySource = function(){
		return xyArraySource;
	}	
	this.getXyArrayDestination = function(){
		return xyArrayDestination;
	}
	this.getParameters = function(){
		return parameters;
	}
	
	this.transform = function(xSource, ySource){
		var res = new Array();
		var A = parameters[0][0];
		var B = parameters[0][1];
		var C = parameters[0][2];
		var D = parameters[1][0];
		var E = parameters[1][1];
		var F = parameters[1][2];
		
		var xTo = A * xSource + B * ySource + C;
		var yTo = D * xSource + E * ySource + F;
		res.push(xTo);
		res.push(yTo);
		return res;
	}

}


