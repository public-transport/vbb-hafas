var url =				require('url');
var extend =			require('extend');
var parseIsoDuration =	require('parse-iso-duration');
var sDate =				require('s-date');
var bluebird =			require('bluebird');
var request =			bluebird.promisify(require('request'));

var errors =			require('./util/errors');
var products =			require('./util/products');
var locations =			require('./util/locations');
var transports =		require('./util/transports');
// todo: time & date module





var Client = module.exports = {



	// util
	errors:		errors,
	products:	products,
	locations:	locations,
	transports:	transports,

	endpoint:	'http://demo.hafas.de/openapi/vbb-proxy/',
	accessId:	null,



	init: function (accessId, endpoint) {
		if (!accessId) throw new Error('Missing `accessId`.');
		this.accessId = accessId;

		if (endpoint) this.endpoint = endpoint;

		return this;
	},





	_locationDefaults: {
		results:		5,
		stations:		true,
		addresses:		true,
		pois:			true,
		products: {
			suburban:	true,
			subway:		true,
			tram:		true,
			bus:		true,
			ferry:		true,
			express:	false,
			regional:	true
		}
	},

	location: function (query, options) {
		if (!query) throw new Error('Missing `query` parameter.');

		options = extend(true, {}, this._locationDefaults, options || {});

		params = {
			input:			query,
			maxNo:			options.results,
			type: this.locations.createApiString({
				station:	options.stations,
				address:	options.addresses,
				poi:		options.pois
			}),
			products:		this.products.createApiNumber(options.products)
		};

		this._request('location.name', params, [this._locationOnSuccess]);
	},



	_locationOnSuccess: function (data) {
		var results = [];
		var i, length, loc, result;

		if (!data.StopLocation && !data.CoordLocation) return results;   // abort

		if (data.StopLocation)
			for (i = 0, length = data.StopLocation.length; i < length; i++) {
				loc = data.StopLocation[i];
				result = this.locations.parseApiLocation(loc);
				result.products = this.products.parseApiNumber(loc.products);
				results.push(result);
			}

		if (data.CoordLocation)
			for (i = 0, length = data.CoordLocation.length; i < length; i++) {
				results.push(this.locations.parseApiLocation(data.CoordLocation[i]));
			}

		console.log(results);
		return results;
	},





	_journeysDefaults: {
		origin:				null,
		originLat:			null,
		originLong:			null,
		destination:		null,
		destinationLat:		null,
		destinationLong:	null,
		via:				null,

		results:			5,
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

	journeys: function (options) {
		options = extend(true, {}, this._journeysDefaults, options || {});

		if (!options.when) options.when = new Date();   // now
		params = {
			changeTimePercent:	Math.round(options.changeTimeFactor * 100),
			date:				sDate('{yyyy}-{mm}-{dd}', options.when),
			time:				sDate('{hh24}:{Minutes}', options.when),
			numF:				0,
			numB:				options.results > 6 ? 6 : options.results,
			products:			this.products.createApiNumber(options.products)
		};
		if (typeof options.changes === 'number') params.maxChange = options.changes;
		if (options.via) params.via = options.via;

		if (options.origin)
			params.originId = this.locations.createApiId(options.origin);
		else if (options.originLat && options.originLong) {
			params.originCoordLat = options.originLat;
			params.originCoordLong = options.originLong;
		} else
			throw new Error('Neither `origin` nor `originLat` & `originLong` passed.');

		if (options.destination)
			params.destId = this.locations.createApiId(options.destination);
		else if (options.destinationLat && options.destinationLong) {
			params.destCoordLat = options.destinationLat;
			params.destCoordLong = options.destinationLong;
		} else
			throw new Error('Neither `destination` nor `destinationLat` & `destinationLong` passed.');

		return this._request('trip', params, [this._journeysOnSuccess]);
	},



	_journeysOnSuccess: function (data) {
		var results = [];
		var i, tripsLength, trip, result;
		var j, legsLength, leg, part;

		if (!data.Trip) return results;   // abort

		for (i = 0, tripsLength = data.Trip.length; i < tripsLength; i++) {
			trip = data.Trip[i];

			result = {
				duration:	parseIsoDuration(trip.duration.replace(/^[R]T/, 'PT')),
				parts:		[]
			};

			for (j = 0, legsLength = trip.LegList.Leg.length; j < legsLength; j++ ) {
				leg = trip.LegList.Leg[j];

				part = {
					from:		this.locations.parseApiLocation(leg.Origin),
					to:			this.locations.parseApiLocation(leg.Destination),
					transport:	(this.transports[leg.type] || this.transports.unknown).type,
					type:		(this.products[leg.Product.catIn] || this.products.unknown).type,
					direction:	leg.direction
				};
				part.from.when = new Date(leg.Origin.date + ' ' + leg.Origin.time);   // todo: use date & time utility
				part.to.when = new Date(leg.Destination.date + ' ' + leg.Destination.time);   // todo: use date & time utility
				if (leg.Notes) part.notes = this.locations.parseApiNotes(leg.Notes);

				result.parts.push(part);
			}

			// todo: tickets and their prices
			// todo: `leg.Messages`? are they actually being used?
			// todo: `leg.ServiceDays`?
			results.push(result);
		}

		inspect(results);
		return results;
	},





	_departuresDefaults: {
		results:		10,
		when:			null,
		direction:		null,
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

	departures: function (station, options) {
		if (!station) throw new Error('Missing `station` parameter.');

		options = extend(true, {}, this._departuresDefaults, options || {});
		if (!options.when) options.when = new Date();   // now

		params = {
			id:				this.locations.createApiId(station),
			maxJourneys:	options.results,
			date:			sDate('{yyyy}-{mm}-{dd}', options.when),
			time:			sDate('{hh24}:{Minutes}', options.when),
			products:		this.products.createApiNumber(options.products)
		};
		if (options.direction) params.direction = this.locations.createApiId(options.direction);

		return this._request('departureBoard', params, [this._departuresOnSuccess]);
	},



	_departuresOnSuccess: function (data) {
		var results = [];
		var i, length, dep;

		if (!data.Departure) return results;   // abort

		for (i = 0, length = data.Departure.length; i < length; i++) {
			dep = data.Departure[i];
			results.push({
				stop:		this.locations.parseApiId(dep.stopExtId),
				type:		(this.products[dep.Product.catIn] || this.products.unknown).type,
				line:		dep.Product.line,
				direction:	dep.direction,
				when:		new Date(dep.date + ' ' + dep.time),   // todo: use date & time utility
				realtime:	new Date(dep.rtDate + ' ' + dep.rtTime)   // todo: use date & time utility
			});
		}

		console.log(results);
		return results;
	},





	_request: function (service, params, handlers) {
		var target = url.parse(this.endpoint, true);
		target.pathname = path.join(target.pathname, service);

		target.query.format = 'json';
		target.query.accessId = this.accessId;
		extend(target.query, params);
		for (var property in params) {
			target.query[property] = params[property];
		}

		// todo: make this shorter, using the bluebird api
		var promise, i;
		promise = request(url.format(target)).bind(this)
		.then(this._requestOnSuccess);
		for (i = 0; i < handlers.length; i++) {
			promise = promise.then(handlers[i]);
		}
		return promise;
	},

	_requestOnSuccess: function (res) {
		res = res[0];

		try {
			data = JSON.parse(res.body);
		} catch (e) {
			if (res.statusCode < 200 || res.statusCode >= 300)
				throw new this.errors.ConnectionError(res.statusCode, res.statusMessage, res.request.uri, res.request.method);
			else throw new Error('Could not parse response JSON');
		}
		if (data.errorCode) throw this.errors.apiServerError(res, data);

		return data;
	}



};
