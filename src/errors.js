apiErrors =		require('./api-errors');





var errors = module.exports = {};

errors.RequestError = function (code, message, url) {
	this.code =			code;
	this.message =		message;
	this.url =			url;
};
errors.RequestError.prototype.toString = function () {
	return [
		'request error: ',
		this.code,
		'–',
		this.message,
		'(' + this.url + ')'
	].join(' ');
};

errors.HttpError = function (code, message, url, method) {
	this.code =			code;
	this.message =		message;
	this.url =			url;
	this.method =		method;
};
errors.HttpError.prototype.toString = function () {
	return [
		'HTTP error: ',
		this.code,
		'–',
		this.method,
		this.url
	].join(' ');
};

errors.ApiServerError = function (type, code, message, url, details) {
	this.type =			type;
	this.code =			code;
	this.message =		message;
	this.statusCode =	code;   // http status code
	this.url =			url;
};
errors.ApiServerError.prototype.toString = function () {
	return [
		'API server error: ',
		this.code,
		'–',
		this.message,
		'(' + this.url + ')'
	].join(' ');
};
errors.apiServerError = function (res, data) {
	var unknownError = new errors.ApiServerError('unknown', null, data.errorText, res.request.url, null);
	var group = apiErrors[data.errorCode.substr(0, 1)];
	if (!group) return unknownError;
	var error = group[parseInt(data.errorCode.substr(1))];
	if (!error) return unknownError;
	return new errors.ApiServerError(group.name, error.code, error.message, res.request.url, data.errorText);
};



errors.fromRequestError = function (err) {
	return new errors.RequestError(err.error.code, err.message, err.options.uri);
};

errors.fromStatusCodeError = function (err) {
	try {
		var data = JSON.parse(err.message);
		return errors.apiServerError(err.response, data);
	} catch (e) {
		return new errors.HttpError(err.response.statusCode, err.response.statusMessage, err.options.uri, err.response.request.method);
	}
};
