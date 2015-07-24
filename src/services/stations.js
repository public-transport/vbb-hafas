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
		return this._request('arrivalBoard', this._arrivalsOnSuccess, station, options);
	},
	departures: function (station, options) {
		return this._request('departureBoard', this._departuresOnSuccess, station, options);
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
	_request: function (service, handler, station, options) {
		if (!service) throw new Error('Missing `service` parameter.');
		if (!handler) throw new Error('Missing `handler` parameter.');
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
		.then(handler, console.error);   // todo: remove `console.error`
	},

	_arrivalsOnSuccess: function (data) {
		var results = [];
		var i, length, departure;

		if (data.Arrival)
			for (i = 0, length = data.Arrival.length; i < length; i++) {
				departure = data.Arrival[i];
				// todo: what is `departure.type`?
				results.push({
					name:		departure.Product.name,
					line:		departure.Product.line,
					product:	products[departure.trainCategory].type,
					when:		new Date(departure.date + ' ' + departure.time),
					realtime:	new Date(departure.rtDate + ' ' + departure.rtTime)
				});
			}

		return results;
	},

	_departuresOnSuccess: function (data) {
		var results = [];
		var i, length, departure;

		if (data.Departure)
			for (i = 0, length = data.Departure.length; i < length; i++) {
				departure = data.Departure[i];
				// todo: what is `departure.type`?
				results.push({
					name:		departure.Product.name,
					line:		departure.Product.line,
					direction:	departure.direction,
					product:	products[departure.trainCategory].type,
					when:		new Date(departure.date + ' ' + departure.time),
					realtime:	new Date(departure.rtDate + ' ' + departure.rtTime)
				});
			}

		return results;
	}



};
