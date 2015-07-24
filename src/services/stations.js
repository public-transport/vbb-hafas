extend =		require('extend');
sDate =			require('s-date');





var stations = module.exports = {



	client: null,



	init: function (client) {
		if (!client) throw new Error('Missing `client`.');
		this.client = client;

		return this;
	},



	arrivals: function (station, options) {
		return this._request('arrivalBoard', station, options);
	},
	departures: function (station, options) {
		return this._request('departureBoard', station, options);
	},



	_requestDefaults: {
		results:	3,   // todo: change to 10
		when:		null,
		direction:	null,
		products: {
			suburban:	true,
			subway:		true,
			tram:		true,
			bus:		true,
			ferry:		true,
			express:	true,
			regional:	true
		}
	},

	// returns a promise
	_request: function (service, station, options) {
		if (!service) throw new Error('Missing `service` parameter.');
		if (!station) throw new Error('Missing `station` parameter.');

		options = extend(true, {}, this._requestDefaults, options || {});
		if (!options.when) options.when = new Date();   // now

		params = {
			id:				station,
			maxJourneys:	options.results,
			date:			sDate('{yyyy}-{mm}-{dd}', options.when),
			time:			sDate('{hh24}:{Minutes}', options.when),
			products:		products.typesToNumber(options.products)
		};
		if (options.direction) params.direction = options.direction;

		return this.client._request(service, params)
		.then(this._requestOnSuccess, console.error);   // todo: remove `console.error`
	},

	_requestOnSuccess: function (data) {
		var results = [];
		var list, i, length, departure;

		if (data.Arrival) list = data.Arrival;
		else if (data.Departure) list = data.Departure;
		else return [];

		for (i = 0, length = list.length; i < length; i++) {
			// todo: what is `list[i].type`?
			departure = {
				name:		list[i].Product.name,
				line:		list[i].Product.line,
				product:	products[list[i].trainCategory].type,
				when:		new Date(list[i].date + ' ' + list[i].time),
				realtime:	new Date(list[i].rtDate + ' ' + list[i].rtTime)
			};
			if (data.Arrival) departure.origin = list[i].origin;
			else if (data.Departure) departure.destination = list[i].destination;
			results.push(departure);
		}

		return results;
	}



};
