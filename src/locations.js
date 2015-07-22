var locations = module.exports = {};

locations.station = locations.S = locations.ST = {
	id:		'ST',
	alt:	'S',
	type:	'station'
};
locations.address = locations.A = locations.ADR = {
	id:		'ADR',
	alt:	'A',
	type:	'address'
};
locations.poi = locations.P = locations.POI = {
	id:		'POI',
	alt:	'P',
	type:	'poi'
};



locations.typesToString = function (types) {
	var result = '';
	for (var type in types) {
		if (types[type] && locations[type])
			result += locations[type].alt;
	}
	return result;
};

locations.stringToTypes = function (string) {
	var result = {};
	for (var alt of string) {
		if (locations[alt]) result[locations[alt].type] = true;
	}
	return result;
};
