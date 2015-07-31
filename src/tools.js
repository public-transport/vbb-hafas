parseIsoDuration =	require('parse-iso-duration');





var tools = module.exports = {

	parseDuration: function (string) {
		var result = {
			milliseconds: string.slice(1)
		};
		if (string.slice(0, 1) === 'R')
			result.realtime = true;
		else if (string.slice(0, 1) === 'P')
			result.planned = true;
		return result;
	}

};
