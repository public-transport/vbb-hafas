var p = module.exports = {

	suburban: {
		category:	0,
		bitmask:	1,
		name:		'S-Bahn',
		short:		'S',
		type:		'suburban'
	},

	subway: {
		category:	1,
		bitmask:	2,
		name:		'U-Bahn',
		short:		'U',
		type:		'subway'
	},

	tram: {
		category:	2,
		bitmask:	4,
		name:		'Tram',
		short:		'T',
		type:		'tram'
	},

	bus: {
		category:	3,
		bitmask:	8,
		name:		'Bus',
		short:		'B',
		type:		'bus'
	},

	ferry: {
		category:	4,
		bitmask:	16,
		name:		'Fähre',
		short:		'F',
		type:		'ferry'
	},

	express: {
		category:	5,
		bitmask:	32,
		name:		'IC/ICE',
		short:		'I',
		type:		'express'
	},

	regional: {
		category:	6,
		bitmask:	64,
		name:		'RB/RE',
		short:		'R',
		type:		'regional'
	},

	unknown: {
		category:	null,
		bitmask:	0,
		name:		'unknown',
		short:		'?',
		type:		'unknown'
	}

};



// used for the `products` bitmask
p.bitmasks = [];
p.bitmasks[1] = p.suburban;
p.bitmasks[2] = p.subway;
p.bitmasks[4] = p.tram;
p.bitmasks[8] = p.bus;
p.bitmasks[16] = p.ferry;
p.bitmasks[32] = p.express;
p.bitmasks[64] = p.regional;



// used to determine the `type`
p.types = [
	p.suburban,
	p.subway,
	p.tram,
	p.bus,
	p.ferry,
	p.express,
	p.regional,
	p.unknown
];



p.createApiBitmask = function (types) {
	var result = 0;
	for (var type in types) {
		if (types[type] != true) continue;
		result += p[type].bitmask;
	}
	return result;
};
p.parseApiBitmask = function (number) {
	var result = {}, i = 1;
	do {
		result[p.bitmasks[i].type] = !!(number & i);
		i *= 2;
	} while (p.bitmasks[i] && p.bitmasks[i].type)
	return result;
};



p.parseApiType = function (type) {
	return p.types[parseInt(type)] || p.unknown;
};
