// todo:
// - find out what these shitty errors mean
// - write reasonable, grammatically correct, helpful error messages

var e = module.exports = {
	R: [],
	S: [],
	H: [],
	SQ: [],
	TI: []
};

e.R.name = 'REST request error';
e.S.name = 'backend server error';
e.H.name = 'trip search error';
e.SQ.name = 'departure and arrival board error';
e.TI.name = 'journey details error';

e.R[1] = {
	'code':		'R0001',
	'message':	'Unknown service method'
};
e.R[2] = {
	'code':		'R0002',
	'message':	'Invalid or missing request parameters'
};
e.R[7] = {
	'code':		'R0007',
	'message':	'Internal communication error'
};
e.R[100] = {
	'code':		'R500',
	'message':	'Access denied'
};

e.S[1] = {
	'code':		'S1',
	'message':	'The desired connection to the server could not be established or was not stable.'
};

e.H[390] = {
	'code':		'H380',
	'message':	'Departure/Arrival replaced by an equivalent station'
};
e.H[410] = {
	'code':		'H410',
	'message':	'Display may be incomplete due to change of timetable'
};
e.H[455] = {
	'code':		'H455',
	'message':	'Prolonged stop'
};
e.H[460] = {
	'code':		'H460',
	'message':	'One or more stops are passed through multiple times.'
};
e.H[500] = {
	'code':		'H500',
	'message':	'Because of too many trains the connection is not complete'
};
e.H[890] = {
	'code':		'H890',
	'message':	'Unsuccessfully search.'   // wat
};
e.H[891] = {
	'code':		'H891',
	'message':	'No route found (try entering an intermediate station)'
};
e.H[892] = {
	'code':		'H892',
	'message':	'Inquiry too complex (try entering less intermediate stations)'
};
e.H[895] = {
	'code':		'H895',
	'message':	'Departure/Arrival is too near'
};
e.H[899] = {
	'code':		'H899',
	'message':	'Unsuccessful or incomplete search (timetable change)'
};
e.H[900] = {   // duplicate of `H899`, lol
	'code':		'H900',
	'message':	'Unsuccessful or incomplete search (timetable change)'
};
e.H[9220] = {
	'code':		'H9220',
	'message':	'Nearby to the given address stations could not be found'
};
e.H[9230] = {
	'code':		'H9230',
	'message':	'An internal error occurred'
};
e.H[9240] = {
	'code':		'H9240',
	'message':	'Unsuccessful search'
};
e.H[9250] = {
	'code':		'H9250',
	'message':	'Part inquiry interrupted'
};
e.H[9260] = {
	'code':		'H9260',
	'message':	'Unknown departure station'
};
e.H[9280] = {
	'code':		'H9280',
	'message':	'Unknown intermediate station'
};
e.H[9300] = {
	'code':		'H9300',
	'message':	'Unknown arrival station'
};
e.H[9320] = {
	'code':		'H9320',
	'message':	'The input is incorrect or incomplete'
};
e.H[9360] = {
	'code':		'H9360',
	'message':	'Error in data field'
};
e.H[9380] = {
	'code':		'H9380',
	'message':	'Dep./Arr./Intermed. or equivalent stations defined more than once'
};

e.SQ[1] = {
	'code':		'SQ001',
	'message':	'No station board available.'
};
e.SQ[2] = {
	'code':		'SQ002',
	'message':	'There was no journey found for the requested board or time.'
};

e.TI[1] = {
	'code':		'TI001',
	'message':	'No trip journey information available.'
};
