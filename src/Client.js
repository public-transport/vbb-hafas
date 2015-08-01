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
