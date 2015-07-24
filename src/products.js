var products = module.exports = [];

products.suburban = products.S = products[1] = {
	id:		1,
	name:	'S-Bahn',
	short:	'S',
	type:	'suburban'
};
products.subway = products.U = products[2] = {
	id:		2,
	name:	'U-Bahn',
	short:	'U',
	type:	'subway'
};
products.tram = products.T = products.MT = products[4] = {
	id:		4,
	name:	'Tram',
	short:	'T',
	type:	'tram'
};
products.bus = products.B = products.MB = products[8] = {
	id:		8,
	name:	'Bus',
	short:	'B',
	type:	'bus'
};
products.ferry = products.F = products[16] = {
	id:		16,
	name:	'Fähre',
	short:	'F',
	type:	'ferry'
};
products.express = products.todo = products[32] = {
	id:		32,
	name:	'IC/ICE',
	short:	'todo',
	type:	'express'
};
products.regional = products.todo = products[64] = {
	id:		64,
	name:	'RB/RE',
	short:	'todo',
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
