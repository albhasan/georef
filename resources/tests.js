/*
Copyright © 2000 Alber Sanchez <albhasan@gmail.com>
This work is free. You can redistribute it and/or modify it under the
terms of the Do What The Fuck You Want To Public License, Version 2,
as published by Sam Hocevar. See the COPYING file for more details.
*/


//Coords in the map
var xyMap1 = new Array(97799.72, 53116.92);
var xyMap2 = new Array(98954.56, 63419.03);
var xyMap3 = new Array(108181.95, 63175.97);
var xyMap4 = new Array(107882.7, 53106.30);
var xyMap5 = new Array(104019.3, 58850.44);

//Coords in the image (first quadrant)
var xyImage1Q_1 = new Array(374, 146);
var xyImage1Q_2 = new Array(596, 3263);
var xyImage1Q_3 = new Array(3378, 3307);
var xyImage1Q_4 = new Array(3414, 255);
var xyImage1Q_5 = new Array(2177, 1940);

var xySource = new Array(xyMap1, xyMap2, xyMap3);
var xyDestination = new Array(xyImage1Q_1, xyImage1Q_2, xyImage1Q_3);

	
test("SimilarityTransformation", function(){
	
	//Get the transformation parameters
	var simTrans = new SimilarityTransformation(xySource, xyDestination);
	var param = simTrans.getParameters();
	
	var decimalPlaces = 2;
	equal(roundNumber(param[0], decimalPlaces), roundNumber(-2.843056e+04, decimalPlaces));
	equal(roundNumber(param[1], decimalPlaces), roundNumber(-1.707418e+04, decimalPlaces));
	equal(roundNumber(param[2], decimalPlaces), roundNumber(3.012922e-01, decimalPlaces));
	equal(roundNumber(param[3], decimalPlaces), roundNumber(-1.243784e-02, decimalPlaces));
	
	
	//Applies the transformation
	var xyMap4Trans = simTrans.transform(xyMap4[0], xyMap4[1]);
	var xyMap5Trans = simTrans.transform(xyMap5[0], xyMap5[1]);
	
	decimalPlaces = 1;
	equal(roundNumber(xyMap4Trans[0], decimalPlaces), roundNumber(3413.137, decimalPlaces));
	equal(roundNumber(xyMap4Trans[1], decimalPlaces), roundNumber(268.1597, decimalPlaces));
	equal(roundNumber(xyMap5Trans[0], decimalPlaces), roundNumber(2177.681, decimalPlaces));
	equal(roundNumber(xyMap5Trans[1], decimalPlaces), roundNumber(1950.7717, decimalPlaces));
	
});	
	
test("AffineTransformation", function(){
	//Get the transformation parameters
	var affTrans = new AffineTransformation(xySource, xyDestination);
	var param = affTrans.getParameters();

	//Applies the transformation
	var xyMap4Trans = affTrans.transform(xyMap4[0], xyMap4[1]);
	var xyMap5Trans = affTrans.transform(xyMap5[0], xyMap5[1]);

	var tolerance = 3;
	ok(Math.abs(xyMap4Trans[0] - 3413.137) < tolerance);
	ok(Math.abs(xyMap4Trans[1] - 268.1597) < tolerance);
	ok(Math.abs(xyMap5Trans[0] - 2177.681) < tolerance);
	ok(Math.abs(xyMap5Trans[1] - 1950.7717) < tolerance);

});