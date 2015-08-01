var sDate =				require('s-date');





module.exports = {



	parseApiDateTime: function (date, time) {
		return new Date(date + ' ' + time);
	},



	createApiDate: function (when) {
		return sDate('{yyyy}-{mm}-{dd}', when);
	},

	createApiTime: function (when) {
		return sDate('{hh24}:{Minutes}', when);
	}



};
