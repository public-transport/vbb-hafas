url =		require('url');
path =		require('path');
request =	require('request');
extend =	require('extend');
sDate =		require('s-date');

products =	require('./products');
locations =	require('./locations');

services =		require('./services');




module.exports = {



	products: products,
	locations: locations,

	endpoint: 'http://demo.hafas.de/openapi/vbb-proxy/',
	accessId: null,

	services: services,



	init: function (accessId, endpoint) {
		if (!accessId)
			throw new Error('Missing `accessId`.');
		this.accessId = accessId;

		if (endpoint)
			this.endpoint = endpoint;

		for (var service in this.services) {
			this[service] = Object.create(this.services[service]);
			this[service].init(this);
		}

		return this;
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

	},

	}



};
