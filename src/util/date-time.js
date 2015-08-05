var sDate =				require('s-date');
var parseIsoDuration =	require('parse-iso-duration');





module.exports = {



	parseApiDateTime: function (date, time) {
		return new Date(date + ' ' + time);
	},



	createApiDate: function (when) {
		return sDate('{yyyy}-{mm}-{dd}', when);
	},

	createApiTime: function (when) {
		return sDate('{hh24}:{Minutes}', when);
	},



	parseApiDuration: function (duration) {
		return parseIsoDuration(duration.replace(/^[R]T/, 'PT'));
	}



};
