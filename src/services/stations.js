extend =		require('extend');
sDate =			require('s-date');





var stations = module.exports = {



	client: null,



	init: function (client) {
		if (!client) throw new Error('Missing `client`.');
		this.client = client;

		return this;
	},


	_departuresDefaults: {
		results:	10,
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
	departures: function (id, options) {
		if (!id) throw new Error('Missing `id` parameter.');

		options = extend(true, {}, this._departuresDefaults, options || {});
		if (!options.when) options.when = new Date();   // now

		params = {
			id:				id,
			maxNo:			options.results,
			date:			sDate('{yyyy}-{mm}-{dd}', options.when),
			time:			sDate('{hh24}:{Minutes}', options.when),
			products:		products.typesToNumber(options.products)
		};
		if (options.direction) params.direction = options.direction;

		return this.client._request('departureBoard', params)
		.then(this._departuresOnSuccess, console.error);   // remove `console` parts
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
