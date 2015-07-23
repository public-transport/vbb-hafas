url =			require('url');
extend =		require('extend');
request =		require('request-promise');

errors =		require('./errors');
services =		require('./services');





var Client = module.exports = {



	errors: errors,

	endpoint: 'http://demo.hafas.de/openapi/vbb-proxy/',
	accessId: null,

	services: services,



	init: function (accessId, endpoint) {
		if (!accessId) throw new Error('Missing `accessId`.');
		this.accessId = accessId;

		if (endpoint) this.endpoint = endpoint;

		for (var service in this.services) {
			this[service] = Object.create(this.services[service]);
			this[service].init(this);
		}

		return this;
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
