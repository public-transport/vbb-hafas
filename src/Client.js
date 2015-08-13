var url =				require('url');
var path =				require('path');
var extend =			require('extend');
var bluebird =			require('bluebird');
var request =			bluebird.promisify(require('request'));

var util =				require('vbb-util');
var errors =			require('./util/errors');





var Client = module.exports = {

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
			type: util.locations.types.stringify({
				station:	options.stations,
				address:	options.addresses,
				poi:		options.pois
			}),
			accessId:		options.apiKey || this.apiKey
		};

		return this._request('location.name', params)
		.then(this._locationsOnSuccess);
	},



	_locationsOnSuccess: function (data) {
		var results = [];
		var i, length, loc, result;

		if (!data.StopLocation && !data.CoordLocation) return results;   // abort

		if (data.StopLocation)
			for (i = 0, length = data.StopLocation.length; i < length; i++) {
				results.push(util.locations.parse(data.StopLocation[i]));
			}

		if (data.CoordLocation)
			for (i = 0, length = data.CoordLocation.length; i < length; i++) {
				results.push(util.locations.parse(data.CoordLocation[i]));
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
			date:				util.dateTime.stringifyToDate(options.when),
			time:				util.dateTime.stringifyToTime(options.when),
			numB:				0,
			numF:				options.results > 6 ? 6 : options.results,
			products:			util.products.stringifyBitmask(options.products),
			accessId:			options.apiKey || this.apiKey
		};
		if (typeof options.changes === 'number') params.maxChange = options.changes;
		if (options.via) params.via = options.via;

		if (options.from)
			params.originId = util.locations.stations.stringifyId(options.from);
		else if (options.fromLatitude && options.fromLongitude) {
			params.originCoordLat = options.fromLatitude;
			params.originCoordLong = options.fromLongitude;
		} else
			throw new Error('Neither `from` nor `fromLatitude` & `fromLongitude` passed.');

		if (options.to)
			params.destId = util.locations.stations.stringifyId(options.to);
		else if (options.toLatitude && options.toLongitude) {
			params.destCoordLat = options.toLatitude;
			params.destCoordLong = options.toLongitude;
		} else
			throw new Error('Neither `to` nor `toLatitude` & `toLongitude` passed.');

		return this._request('trip', params)
		.then(this._routesOnSuccess);
	},



	_routesOnSuccess: function (data) {
		if (!data.Trip) return results;   // abort
		var results = [];

		var i, tripsLength, trip, result;
		for (i = 0, tripsLength = data.Trip.length; i < tripsLength; i++) {
			trip = data.Trip[i];

			result = {
				duration:	util.duration.parse(trip.duration),
				parts:		[]
			};

			var j, legsLength, leg, part;
			for (j = 0, legsLength = trip.LegList.Leg.length; j < legsLength; j++ ) {
				leg = trip.LegList.Leg[j];

				part = {
					from:		util.locations.parse(leg.Origin),
					to:			util.locations.parse(leg.Destination),
					transport:	util.routes.legs.types.parse(leg.type).type,
				};
				part.from.when = util.dateTime.parse(leg.Origin.date, leg.Origin.time);
				part.to.when = util.dateTime.parse(leg.Destination.date, leg.Destination.time);

				if (leg.Notes) part.notes = util.routes.legs.notes.parse(leg.Notes);

				if (part.transport === 'public') {
					part.type = util.products.parseCategory(leg.Product.catCode).type;
					part.line = part.type === util.products.express.type ? null : leg.Product.line;   // fixes #8
					part.direction = leg.direction;   // todo: fix #11
				}

				result.parts.push(part);
			}

			if (trip.TariffResult)
				try {
					result.tickets = util.routes.fares.parse(trip.TariffResult.fareSetItem[0].fareItem[0].ticket);
				} catch (e) {}

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
			id:				util.locations.stations.stringifyId(station),
			maxJourneys:	options.results,
			date:			util.dateTime.stringifyToDate(options.when),
			time:			util.dateTime.stringifyToTime(options.when),
			products:		util.products.stringifyBitmask(options.products),
			accessId:		options.apiKey || this.apiKey
		};
		if (options.direction) params.direction = util.locations.stations.stringifyId(options.direction);

		return this._request('departureBoard', params)
		.then(this._departuresOnSuccess);
	},



	_departuresOnSuccess: function (data) {
		if (!data.Departure) return results;   // abort
		var results = [];

		var i, length, dep, result;
		for (i = 0, length = data.Departure.length; i < length; i++) {
			dep = data.Departure[i];
			result = {
				stop:		util.locations.stations.parseId(dep.stopExtId),
				type:		util.products.parseCategory(dep.Product.catCode).type,
				direction:	dep.direction,
				when:		util.dateTime.parse(dep.date, dep.time)
			};
			result.line = dep.type === util.products.express.type ? null : dep.Product.line;   // fixes #8
			if (dep.rtDate && dep.rtTime)
				result.realtime = util.dateTime.parse(dep.rtDate, dep.rtTime);
			// todo: notes
			results.push(result);
		}

		return results;
	},





	_request: function (service, params) {
		var target = url.parse(this.endpoint, true);
		target.pathname = path.join(target.pathname, service);

		target.query.format = 'json';
		target.query.lang = 'en';
		extend(target.query, params);

		return request(url.format(target)).bind(this)
		.then(this._requestOnSuccess);
	},

	_requestOnSuccess: function (res) {
		res = res[0];

		try {
			data = JSON.parse(res.body);
		} catch (e) {
			if (res.statusCode < 200 || res.statusCode >= 300)
				throw new errors.ConnectionError(res.statusCode, res.statusMessage, res.request.uri, res.request.method);
			else throw new Error('Could not parse response JSON');
		}
		if (data.errorCode) throw errors.apiServerError(res, data);

		return data;
	}



};
