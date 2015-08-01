apiErrors =		require('./api-errors');





var e = module.exports = {};



e.RequestError = function (code, message, url) {
	Error.call(this, message);
	this.code =			code;
	this.message =		message;
	this.url =			url;
};

e.RequestError.prototype = Object.create(Error.prototype);
e.RequestError.prototype.constructor = e.RequestError;

e.RequestError.prototype.toString = function () {
	return [
		'request error: ',
		this.code,
		'–',
		this.message,
		'(' + this.url + ')'
	].join(' ');
};



e.HttpError = function (code, message, url, method) {
	Error.call(this, message);
	this.code =			code;
	this.message =		message;
	this.url =			url;
	this.method =		method;
};

e.HttpError.prototype = Object.create(Error.prototype);
e.HttpError.prototype.constructor = e.HttpError;

e.HttpError.prototype.toString = function () {
	return [
		'HTTP error: ',
		this.code,
		'–',
		this.method,
		this.url
	].join(' ');
};



e.ApiServerError = function (type, code, message, url, details) {
	Error.call(this, message);
	this.type =			type;
	this.code =			code;
	this.message =		message;
	this.statusCode =	code;   // http status code
	this.url =			url;
};

e.ApiServerError.prototype = Object.create(Error.prototype);
e.ApiServerError.prototype.constructor = e.ApiServerError;

e.ApiServerError.prototype.toString = function () {
	return [
		'API server error: ',
		this.code,
		'–',
		this.message,
		'(' + this.url + ')'
	].join(' ');
};

e.apiServerError = function (res, data) {
	var unknownError = new e.ApiServerError('unknown', null, data.errorText, res.request.url, null);
	var group = apiErrors[data.errorCode.substr(0, 1)];
	if (!group) return unknownError;
	var error = group[parseInt(data.errorCode.substr(1))];
	if (!error) return unknownError;
	return new e.ApiServerError(group.name, error.code, error.message, res.request.url, data.errorText);
};



e.fromRequestError = function (err) {
	return new e.RequestError(err.error.code, err.message, err.options.uri);
};

e.fromStatusCodeError = function (err) {
	try {
		var data = JSON.parse(err.message);
		return e.apiServerError(err.response, data);
	} catch (e) {
		return new e.HttpError(err.response.statusCode, err.response.statusMessage, err.options.uri, err.response.request.method);
	}
};
