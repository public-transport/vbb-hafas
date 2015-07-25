//extend =		require('extend');





var journeys = module.exports = {



	client: null,



	init: function (client) {
		if (!client) throw new Error('Missing `client`.');
		this.client = client;

		return this;
	},



	// todo
	_searchDefaults: {
		origin:				null,
		originLat:			null,
		originLong:			null,
		destination:		null,
		destinationLat:		null,
		destinationLong:	null,
		via:				null,

		results:			3,   // todo: change to 10
		when:				null,
		changes:			null,
		changeTimeFactor:	1,
		products: {
			suburban:		true,
			subway:			true,
			tram:			true,
			bus:			true,
			ferry:			true,
			express:		true,
			regional:		true
		}
	},

	// returns a promise
	search: function (options) {
		options = extend(true, {}, this._searchDefaults, options || {});

		if (!options.when) options.when = new Date();   // now
		params = {
			changeTimePercent:	options.changeTimeFactor * 100,
			date:				sDate('{yyyy}-{mm}-{dd}', options.when),
			time:				sDate('{hh24}:{Minutes}', options.when),
			numF:				0,
			numB:				options.results > 6 ? 6 : options.results,
			products:			products.typesToNumber(options.products)
		};
		if (typeof options.changes === 'number') params.maxChange = options.changes;
		if (options.via) params.via = options.via;

		if (options.origin)
			params.originId = options.origin;
		else if (options.originLat && options.originLong) {
			params.originCoordLat = options.originLat;
			params.originCoordLong = options.originLong;
		} else
			throw new Error('Neither `origin` nor `originLat` & `originLong` passed.');

		if (options.destination)
			params.destinationId = options.destination;
		else if (options.destinationLat && options.destinationLong) {
			params.destinationCoordLat = options.destinationLat;
			params.destinationCoordLong = options.destinationLong;
		} else
			throw new Error('Neither `destination` nor `destinationLat` & `destinationLong` passed.');

		return this.client._request('trip', params)
		.then(console.log, function(err){throw err});   // todo: remove `console.error`
	}



};
