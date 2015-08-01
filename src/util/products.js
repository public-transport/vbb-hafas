var p = module.exports = [];



p.suburban = p.S = p['S-7'] = p['S-6'] = p.S12 = p[1] = {   // @vbb: wtf?
	id:		1,
	name:	'S-Bahn',
	short:	'S',
	type:	'suburban'
};



p.subway = p.U = p[2] = {
	id:		2,
	name:	'U-Bahn',
	short:	'U',
	type:	'subway'
};



p.tram = p.T = p.MT = p[4] = {
	id:		4,
	name:	'Tram',
	short:	'T',
	type:	'tram'
};



p.bus = p.B = p.MB = p[8] = {
	id:		8,
	name:	'Bus',
	short:	'B',
	type:	'bus'
};



p.ferry = p.F = p[16] = {
	id:		16,
	name:	'Fähre',
	short:	'F',
	type:	'ferry'
};



p.express = p.ICK = p.ICE = p.ECK = p[32] = {
	id:		32,
	name:	'IC/ICE',
	short:	'I',
	type:	'express'
};



p.regional = p.RB = p.RE = p[64] = {
	id:		64,
	name:	'RB/RE',
	short:	'R',
	type:	'regional'
};



p.unknown = {
	id:		null,
	name:	'unknown',
	short:	'?',
	type:	'unknown'
};



p.createApiNumber = function (types) {
	var result = 0;
	for (var type in types) {
		if (types[type] != true) continue;
		result += p[type].id;
	}
	return result;
};
p.parseApiNumber = function (number) {
	var result = {}, i = 1;
	do {
		result[p[i].type] = !!(number & i);
		i *= 2;
	} while (p[i] && p[i].type)
	return result;
};
