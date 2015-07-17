url =		require('url');
path =		require('path');
request =	require('request');
extend =	require('extend');
sDate =		require('s-date');





var factory = function () {
	instance = Object.create(factory.Client);
	instance.init.apply(instance, arguments);
	return instance;
}





factory.Client = {



	products: [
		{
			id: 1,
			name: 'S',
			type: 'suburban'
		}
		{
			id: 2,
			name: 'U',
			type: 'subway'
		}
		{
			id: 4,
			name: 'Tram',
			type: 'tram'
		}
		{
			id: 8,
			name: 'B',
			type: 'bus'
		}
		{
			id: 16,
			name: 'F',
			type: 'ferry'
		}
		{
			id: 32,
			name: 'IC/ICE',
			type: 'express'
		}
		{
			id: 64,
			name: 'RB/RE',
			type: 'regional'
		}
	],



	endpoint: 'http://demo.hafas.de/openapi/vbb-proxy/',
	accessId: null,



	init: function (accessId, endpoint) {
		if (!accessId)
			throw new Error('Missing `accessId`.');
		this.accessId = accessId;

		if (endpoint)
			this.endpoint = endpoint;
	},



	_request: function (method, params, callback) {
		var target = url.parse(this.endpoint, true);
		target.pathname = path.join(target.pathname, method);

		target.query.format = 'json';
		target.query.accessId = this.accessId;
		var property;
		for (property in params) {
			target.query[property] = params[property];
		}

		target = url.format(target);
		request(target, function (error, response, body) {
			if (error)
				return callback(error);
			if (response.statusCode != 200)
				return callback(new Error('HTTP ' + response.statusCode + ' – ' + response.statusMessage));

			try {
				body = JSON.parse(body);
			} catch (error) {
				return callback(error);
			}

			if (body.errorCode)
				return callback(new Error(body.errorCode + ' – ' + body.errorText));

			callback(null, body);
		});
	},



	// location.name
	searchLocations: function (input, callback) {
		if (!input)
			throw new Error('Missing `input`.');
		if (!callback)
			throw new Error('Missing `callback`.');

		this._request('location.name', {
			input: input
		}, (function (error, data) {
			if (error)
				return callback(error);

			var results = [];
			var i, length, type;

			if (data.StopLocation)
				for (i = 0, length = data.StopLocation.length; i < length; i++) {
					results.push({
						id: this._locationExractId(data.StopLocation[i].id),
						type: 'station',
						name: data.StopLocation[i].name,
						latitude: data.StopLocation[i].lat,
						longitude: data.StopLocation[i].lon
						// todo: products, notes
					});
				}

			if (data.CoordLocation)
				for (i = 0, length = data.CoordLocation.length; i < length; i++) {
					switch (data.CoordLocation[i].type) {
						case 'ADR': type = 'address'; break;
						case 'POI': type = 'poi'; break;
						default: type = 'unknown'; break;
					}
					results.push({
						type: type,
						name: data.CoordLocation[i].name,
						latitude: data.CoordLocation[i].lat,
						longitude: data.CoordLocation[i].lon
					});
				}

			callback(error, results);
		}).bind(this));
	},

	_locationExractId: function (id) {
			id = id.split('@');
			var i, part;
			for (i = 0; i < id.length; i++){
				part = id[i].split('=');
				if (part[0] === 'L')
					return parseInt(part[1]);
			}
	},



	// location.nearbystops
	nearby: function (latitude, longitude, callback) {
		if (typeof latitude != 'number')
			throw new Error('`latitude` is invalid.');
		if (typeof longitude != 'number')
			throw new Error('`longitude` is invalid.');
		if (!callback)
			throw new Error('Missing `callback`.');

		this._request('location.nearbystops', {
			originCoordLat: latitude,
			originCoordLong: longitude
		}, (function (error, data) {
			if (error)
				return callback(error);
			// todo: parsing & beautifying
			callback(error, data);
		}).bind(this));
	}



	_arrivalsDefaults: {
		direction: null,
		when: null,
		products: {
			suburban:	true,
			subway:		true,
			tram:		true,
			bus:		true,
			ferry:		true,
			express:	true,
			regional:	true
		},
		timeSpan: null,
	}

	// arrivalBoard & departureBoard
	arrivals: function (id, options, callback) {
		if (typeof id != 'number')
			throw new Error('Missing `id`.');
		if (typeof options === 'function') {
			callback = options;
			options = {};
		} else if (!callback)
			throw new Error('Missing `callback`.');

		options = extend(true, {}, this._stationArrivalsDefaults, options);
		var params = {};

		if (options.direction && typeof options.direction != 'number')
			params.direction = options.direction;

		if (!options.when)
			options.when = new Date();
		params.date = sDate('{yyyy}-{mm}-{dd}', options.when);
		params.time = sDate('{hh24}:{Minutes}:{Seconds}', options.when);

		if (!options.products.suburban)
			// todo
		if (!options.products.subway)
			// todo
		if (!options.products.tram)
			params.useTram = 0;
		if (!options.products.bus)
			params.useBus = 0;
		if (!options.products.ferry)
			// todo
		if (!options.products.express)
			// todo
		if (!options.products.regional)
			// todo

		if (options.timeSpan)
			params.timeSpan = options.timeSpan;

		// todo: actual request & parsing
	}



};





module.exports = factory;
