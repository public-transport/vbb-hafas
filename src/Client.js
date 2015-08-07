var url =				require('url');
var path =				require('path');
var extend =			require('extend');
var bluebird =			require('bluebird');
var request =			bluebird.promisify(require('request'));

var util = {
	errors:				require('./util/errors'),
	products:			require('./util/products'),
	locations:			require('./util/locations'),
	transports:			require('./util/transports'),
	dateTime:			require('./util/date-time'),
	fares:				require('./util/fares')
};





var Client = module.exports = {



	// util
	_errors:		util.errors,
	_products:		util.products,
	_locations:		util.locations,
	_transports:	util.transports,
	_dateTime:		util.dateTime,
	_fares:			util.fares,

	endpoint:		'http://demo.hafas.de/openapi/vbb-proxy/',
	apiKey:			null,



	init: function (apiKey, endpoint) {
		if (apiKey) this.apiKey = apiKey;

		if (endpoint) this.endpoint = endpoint;

		return this;
	},





	_locationsDefaults: {
		results:		5,
		stations:		true,
		addresses:		true,
		pois:			true
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
			})
		};

		params.accessId = options.apiKey || this.apiKey;
		return this._request(this.endpoint + 'location.name', params, [this._requestOnSuccess, this._locationsOnSuccess]);
	},



	_locationsOnSuccess: function (data) {
		var results = [];
		var i, length, loc, result;

		if (!data.StopLocation && !data.CoordLocation) return results;   // abort

		if (data.StopLocation)
			for (i = 0, length = data.StopLocation.length; i < length; i++) {
				loc = data.StopLocation[i];
				result = this._locations.parseApiLocation(loc);
				result.products = this._products.parseApiBitmask(loc.products);
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
			products:			this._products.createApiBitmask(options.products)
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

		params.accessId = options.apiKey || this.apiKey;
		return this._request(this.endpoint + 'trip', params, [this._requestOnSuccess, this._routesOnSuccess]);
	},



	_routesOnSuccess: function (data) {
		var results = [];
		var i, tripsLength, trip, result;
		var j, legsLength, leg, part;
		var k, tickets, ticketsLength;

		if (!data.Trip) return results;   // abort

		for (i = 0, tripsLength = data.Trip.length; i < tripsLength; i++) {
			trip = data.Trip[i];

			result = {
				duration:	this._dateTime.parseApiDuration(trip.duration),
				parts:		[]
			};

			for (j = 0, legsLength = trip.LegList.Leg.length; j < legsLength; j++ ) {
				leg = trip.LegList.Leg[j];

				part = {
					from:		this._locations.parseApiLocation(leg.Origin),
					to:			this._locations.parseApiLocation(leg.Destination),
					transport:	(this._transports[leg.type] || this._transports.unknown).type,
				};
				part.from.when = this._dateTime.parseApiDateTime(leg.Origin.date, leg.Origin.time);
				part.to.when = this._dateTime.parseApiDateTime(leg.Destination.date, leg.Destination.time);

				if (part.transport === 'public') {
					part.type = this._products.parseApiType(leg.Product.catCode).type;

					part.line = part.type === this._products.express.type ? null : leg.Product.line;   // fixes #8
					part.direction = leg.direction;
				}

				if (leg.Notes) part.notes = this._locations.parseApiNotes(leg.Notes);

				result.parts.push(part);
			}

			if (trip.TariffResult) {
				result.tickets = [];
				try {
					tickets = trip.TariffResult.fareSetItem[0].fareItem[0].ticket;
				} catch (e) {
					tickets = [];
				}
				for (k = 0, ticketsLength = tickets.length; k < ticketsLength; k++) {
					result.tickets.push(this._fares.parseApiTicket(tickets[k]));
				}
			}

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
			products:		this._products.createApiBitmask(options.products)
		};
		if (options.direction) params.direction = this._locations.createApiId(options.direction);

		params.accessId = options.apiKey || this.apiKey;
		return this._request(this.endpoint + 'departureBoard', params, [this._requestOnSuccess, this._departuresOnSuccess]);
	},



	_departuresOnSuccess: function (data) {
		var results = [];
		var i, length, dep, result;

		if (!data.Departure) return results;   // abort

		for (i = 0, length = data.Departure.length; i < length; i++) {
			dep = data.Departure[i];
			result = {
				stop:		this._locations.parseApiId(dep.stopExtId),
				type:		this._products.parseApiType(dep.Product.catCode).type,
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





	_autocompleteDefaults: {
		results:		5,
		stations:		true,
		addresses:		true,
		pois:			true
	},

	autocomplete: function (query, options) {
		if (!query) throw new Error('Missing `query` parameter.');

		options = extend(true, {}, this._autocompleteDefaults, options || {});

		params = {
			REQ0JourneyStopsS0G:	query,
			REQ0JourneyStopsS0A:	options.results,
			REQ0JourneyStopsB: this._locations.createApiBitmask({
				station:			options.stations,
				address:			options.addressess,
				poi:				options.pois
			})
		};

		return this._request('http://fahrinfo.vbb.de/bin/ajax-getstop.exe/dny', params, [this._autocompleteJsonp, this._requestOnSuccess, this._autocompleteOnSuccess]);
	},



	_autocompleteJsonp: function (res) {
		res[0].body = res[0].body.substring(res[0].body.indexOf('{'), res[0].body.lastIndexOf('}') + 1);
		return res;
	},



	_autocompleteOnSuccess: function (data) {
		var results = [];
		var i, length, loc;

		if (!data.suggestions) return results;   // abort

		for (i = 0, length = data.suggestions.length; i < length; i++) {
			loc = data.suggestions[i];
			results.push({
				id:			this._locations.parseApiId(loc.extId),
				name:		loc.value,
				products:	this._products.parseApiBitmask(loc.productClass),
				type:		this._locations.parseApiBitmask(loc.type).type
			});
		}

		return results;
	},





	_request: function (service, params, handlers) {
		var target = url.parse(service, true);

		target.query.format = 'json';
		target.query.lang = 'en';
		extend(true, target.query, params);

		// todo: make this shorter, using the bluebird api
		var promise, i;
		promise = request(url.format(target)).bind(this);
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
