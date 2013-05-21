/*
Copyright © 2000 Alber Sanchez <albhasan@gmail.com>
This work is free. You can redistribute it and/or modify it under the
terms of the Do What The Fuck You Want To Public License, Version 2,
as published by Sam Hocevar. See the COPYING file for more details.
*/


function isUrlOfImage(testUrl){
	return /^.*\.(jp?g|JP?G|gif|GIF|bmp|BMP)$/.test(testUrl);
}

function padNumber(number, size) {
    var res = "0000000000" + number;
    return res.substr(res.length - size);
}	

function roundNumber(number, places) {
    var multiplier = Math.pow(10, places);
    return (Math.round(number * multiplier) / multiplier);
}

function trasposeArray(anArray){
	var res = anArray.slice(0);//Clone array
	for (var i = 0; i < res.length; i++) {
	  for (var j = 0; j < i; j++) {
		var temp = res[i][j];
		res[i][j] = res[j][i];
		res[j][i] = temp;
	  }
	}
	return res;
}