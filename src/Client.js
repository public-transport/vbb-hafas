url =			require('url');
extend =		require('extend');
request =		require('request-promise');
rErrors =		require('request-promise/errors');

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

		var uri = url.format(target);

		var thus = this;
		return request({
			uri: 						uri,
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
