var url =				require('url');
var path =				require('path');
var extend =			require('extend');
var parseIsoDuration =	require('parse-iso-duration');
var bluebird =			require('bluebird');
var request =			bluebird.promisify(require('request'));

var util = {
	errors:				require('./util/errors'),
	products:			require('./util/products'),
	locations:			require('./util/locations'),
	transports:			require('./util/transports'),
	dateTime:			require('./util/date-time')
};





var Client = module.exports = {



	// util
	_errors:		util.errors,
	_products:		util.products,
	_locations:		util.locations,
	_transports:	util.transports,
	_dateTime:		util.dateTime,

	endpoint:		'http://demo.hafas.de/openapi/vbb-proxy/',
	accessId:		null,



	init: function (accessId, endpoint) {
		if (!accessId) throw new Error('Missing `accessId`.');
		this.accessId = accessId;

		if (endpoint) this.endpoint = endpoint;

		return this;
	},





	_locationsDefaults: {
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

	locations: function (query, options) {
		if (!query) throw new Error('Missing `query` parameter.');

		options = extend(true, {}, this._locationsDefaults, options || {});

		params = {
			input:			query,
			maxNo:			options.results,
			type: this._locations.createApiString({
				station:	options.stations,
				address:	options.addresses,
				poi:		options.pois
			}),
			products:		this._products.createApiNumber(options.products)
		};

		return this._request('location.name', params, [this._locationsOnSuccess]);
	},



	_locationsOnSuccess: function (data) {
		var results = [];
		var i, length, loc, result;

		if (!data.StopLocation && !data.CoordLocation) return results;   // abort

		if (data.StopLocation)
			for (i = 0, length = data.StopLocation.length; i < length; i++) {
				loc = data.StopLocation[i];
				result = this._locations.parseApiLocation(loc);
				result.products = this._products.parseApiNumber(loc.products);
				results.push(result);
			}

		if (data.CoordLocation)
			for (i = 0, length = data.CoordLocation.length; i < length; i++) {
				results.push(this._locations.parseApiLocation(data.CoordLocation[i]));
			}

		return results;
	},





	_routesDefaults: {
		from:				null,
		fromLatitude:		null,
		fromLongitude:		null,
		to:					null,
		toLatitude:			null,
		toLongitude:		null,
		via:				null,

		results:			4,
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

	routes: function (options) {
		options = extend(true, {}, this._routesDefaults, options || {});

		if (!options.when) options.when = new Date();   // now
		params = {
			changeTimePercent:	Math.round(options.changeTimeFactor * 100),
			date:				this._dateTime.createApiDate(options.when),
			time:				this._dateTime.createApiTime(options.when),
			numB:				0,
			numF:				options.results > 6 ? 6 : options.results,
			products:			this._products.createApiNumber(options.products)
		};
		if (typeof options.changes === 'number') params.maxChange = options.changes;
		if (options.via) params.via = options.via;

		if (options.from)
			params.originId = this._locations.createApiId(options.from);
		else if (options.fromLatitude && options.fromLongitude) {
			params.originCoordLat = options.fromLatitude;
			params.originCoordLong = options.fromLongitude;
		} else
			throw new Error('Neither `from` nor `fromLatitude` & `fromLongitude` passed.');

		if (options.to)
			params.destId = this._locations.createApiId(options.to);
		else if (options.toLatitude && options.toLongitude) {
			params.destCoordLat = options.toLatitude;
			params.destCoordLong = options.toLongitude;
		} else
			throw new Error('Neither `to` nor `toLatitude` & `toLongitude` passed.');

		return this._request('trip', params, [this._routesOnSuccess]);
	},



	_routesOnSuccess: function (data) {
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
					from:		this._locations.parseApiLocation(leg.Origin),
					to:			this._locations.parseApiLocation(leg.Destination),
					transport:	(this._transports[leg.type] || this._transports.unknown).type,
				};
				if (part.transport === 'public') {
					part.type = (this._products[leg.Product.catIn] || this._products.unknown).type;

					part.line = part.type === this._products.express.type ? null : leg.Product.line;   // fixes #8
					part.direction = leg.direction;
				}
				part.from.when = this._dateTime.parseApiDateTime(leg.Origin.date, leg.Origin.time);
				part.to.when = this._dateTime.parseApiDateTime(leg.Destination.date, leg.Destination.time);
				if (leg.Notes) part.notes = this._locations.parseApiNotes(leg.Notes);

				result.parts.push(part);
			}

			// todo: tickets and their prices
			// todo: `leg.Messages`? are they actually being used?
			// todo: `leg.ServiceDays`?
			results.push(result);
		}

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
			id:				this._locations.createApiId(station),
			maxJourneys:	options.results,
			date:			this._dateTime.createApiDate(options.when),
			time:			this._dateTime.createApiTime(options.when),
			products:		this._products.createApiNumber(options.products)
		};
		if (options.direction) params.direction = this._locations.createApiId(options.direction);

		return this._request('departureBoard', params, [this._departuresOnSuccess]);
	},



	_departuresOnSuccess: function (data) {
		var results = [];
		var i, length, dep, result;

		if (!data.Departure) return results;   // abort

		for (i = 0, length = data.Departure.length; i < length; i++) {
			dep = data.Departure[i];
			result = {
				stop:		this._locations.parseApiId(dep.stopExtId),
				type:		(this._products[dep.Product.catIn] || this._products.unknown).type,
				direction:	dep.direction,
				when:		this._dateTime.parseApiDateTime(dep.date, dep.time)
			};
			result.line = dep.type === this._products.express.type ? null : dep.Product.line;   // fixes #8
			if (dep.rtDate && dep.rtTime)
				result.realtime = this._dateTime.parseApiDateTime(dep.rtDate, dep.rtTime);
			results.push(result);
		}

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
				throw new this._errors.ConnectionError(res.statusCode, res.statusMessage, res.request.uri, res.request.method);
			else throw new Error('Could not parse response JSON');
		}
		if (data.errorCode) throw this._errors.apiServerError(res, data);

		return data;
	}



};
