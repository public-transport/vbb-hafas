var products = module.exports = [];

products.suburban = products[1] = {
	id:		1,
	name:	'S',
	type:	'suburban'
};
products.subway = products[2] = {
	id:		2,
	name:	'U',
	type:	'subway'
};
products.tram = products[4] = {
	id:		4,
	name:	'Tram',
	type:	'tram'
};
products.bus = products[8] = {
	id:		8,
	name:	'B',
	type:	'bus'
};
products.ferry = products[16] = {
	id:		16,
	name:	'F',
	type:	'ferry'
};
products.express = products[32] = {
	id:		32,
	name:	'IC/ICE',
	type:	'express'
};
products.regional = products[64] = {
	id:		64,
	name:	'RB/RE',
	type:	'regional'
};



products.typesToNumber = function (types) {
	var result = 0;
	for (var type in types) {
		if (types[type] != true) continue;
		result += products[type].id;
	}
	return result;
};

products.numberToTypes = function (number) {
	var result = {}, i = 1;
	do {
		result[products[i].type] = !!(number & i);
		i *= 2;
	} while (products[i] && products[i].type)
	return result;
};
