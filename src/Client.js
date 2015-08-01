url =				require('url');   // todo: remove
inspect = function(e){console.log(util.inspect(e,{depth: null}))};

var url =				require('url');
var extend =			require('extend');
var parseIsoDuration =	require('parse-iso-duration');
var sDate =				require('s-date');
var request =			require('request-promise');
var rErrors =			require('request-promise/errors');

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
		results:		10,
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
			type: locations.createApiString({
				station:	options.stations,
				address:	options.addresses,
				poi:		options.pois
			}),
			products:		products.createApiNumber(options.products)
		};

		return this._request('location.name', params)
		.then(this._locationOnSuccess, console.error);   // todo: remove `console.error`
	},



	_locationOnSuccess: function (data) {
		var results = [];
		var i, length, loc, result;

		if (!data.StopLocation && !data.CoordLocation) return results;   // abort

		if (data.StopLocation)
			for (i = 0, length = data.StopLocation.length; i < length; i++) {
				loc = data.StopLocation[i];
				result = locations.parseApiLocation(loc);
				result.products = products.parseApiNumber(loc.products);
				results.push(result);
			}

		if (data.CoordLocation)
			for (i = 0, length = data.CoordLocation.length; i < length; i++) {
				results.push(locations.parseApiLocation(data.CoordLocation[i]));
			}

		console.log(results);
		return results;
	},





	_departuresDefaults: {
		results:		3,   // todo: change to 10
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
			id:				locations.createApiId(station),
			maxJourneys:	options.results,
			date:			sDate('{yyyy}-{mm}-{dd}', options.when),
			time:			sDate('{hh24}:{Minutes}', options.when),
			products:		products.createApiNumber(options.products)
		};
		if (options.direction) params.direction = locations.createApiId(options.direction);

		return this._request('departureBoard', params)
		.then(this._departuresOnSuccess, console.error);   // todo: remove `console.error`
	},



	_departuresOnSuccess: function (data) {
		var results = [];
		var i, length, dep;

		if (!data.Departure) return results;   // abort

		for (i = 0, length = data.Departure.length; i < length; i++) {
			dep = data.Departure[i];
			results.push({
				stop:		locations.parseApiId(dep.stopExtId),
				type:		(products[dep.Product.catIn] || products.unknown).type,
				line:		dep.Product.line,
				direction:	dep.direction,
				when:		new Date(dep.date + ' ' + dep.time),   // todo: use date & time utility
				realtime:	new Date(dep.rtDate + ' ' + dep.rtTime)   // todo: use date & time utility
			});
		}

		console.log(results);
		return results;
	},





	_request: function (service, params) {
		var target = url.parse(this.endpoint, true);
		target.pathname = path.join(target.pathname, service);

		target.query.format = 'json';
		target.query.accessId = this.accessId;
		extend(target.query, params);
		for (var property in params) {
			target.query[property] = params[property];
		}

		var thus = this;
		return request({
			uri: 						url.format(target),
			resolveWithFullResponse:	true
		})   // returns a promise
		.then(function(res) {   // success handler
			try {
				data = JSON.parse(res.body);
			} catch (e) {
				return new Error('Could not parse response JSON');
			}
			// if (data.errorCode) return thus.errors.apiServerError(res, data);
			if (data.errorCode) return thus.errors.apiServerError(res, data);
			return data;
		}, function (err) {   // error handler
			console.log('err', err);
			if (err instanceof rErrors.RequestError)
				return thus.errors.fromRequestError(err);
			else if (err instanceof rErrors.StatusCodeError) {
				return thus.errors.fromStatusCodeError(err);
			}
		});
	}



};
