url =		require('url');
path =		require('path');
request =	require('request');
extend =	require('extend');
sDate =		require('s-date');
url =			require('url');
extend =		require('extend');
request =		require('request-promise');

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



	_request: function (method, params) {
		var target = url.parse(this.endpoint, true);
		target.pathname = path.join(target.pathname, method);

		target.query.format = 'json';
		target.query.accessId = this.accessId;
		extend(target.query, params);
		for (var property in params) {
			target.query[property] = params[property];
		}

		return request(target)   // promise
		.then(this._requestOnSuccess, this._requestOnError);
	},

	_requestOnSuccess: function (body) {
		body = JSON.parse(body);
		if (body.errorCode) throw new Error(body.errorCode + ' – ' + body.errorText));   // todo: use `.code` & `.message`?
		return body;
	},

	// todo: is this unnecessary?
	_requestOnError: function (err) {
		throw err
	}



};
