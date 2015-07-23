url =			require('url');
extend =		require('extend');
request =		require('request-promise');
requestErrors =	require('request-promise/errors');

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

		var thus = this;
		return request({
			uri: url.format(target)
		})   // returns a promise
		.then(function(data) {   // success handler
			try {
				data = JSON.parse(data);
			} catch (e) {
				return new Error('Could not parse response JSON');
			}
			if (data.errorCode)
				return thus.errors.apiServerError(data);
			return data;
		}, function (err) {   // error handler
			if (err instanceof requestErrors.RequestError)
				return new thus.errors.RequestError(err.error.code, err.message, err.options.uri);
			if (err instanceof requestErrors.StatusCodeError) {
				try {
					var data = JSON.parse(err.message);
					return thus.errors.apiServerError(data);
				} catch (e) {
					return new thus.HttpError(err.options.request.statusCode, err.options.request.statusMessage, err.options.uri, err.options.response.request.method);
				}
			}
		});
	}



};
