apiErrors =		require('./api-errors');





var errors = module.exports = {};

errors.RequestError = function (code, message, url) {
	this.code =			code;
	this.message =		message;
	this.url =			url;
};
errors.RequestError.prototype.toString = function () {
	return [
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
		this.code,
		'–',
		this.message,
		'(' + this.url + ')'
	].join(' ');
};
errors.apiServerError = function (data) {
	var group = apiErrors[data.errorCode.substr(0, 1)];
	var error = group[parseInt(data.errorCode.substr(1))];
	if (group && error)
		return new ApiServerError(group.name, error.code, error.message, err.options.uri, data.errorText);
	else
		return new ApiServerError('unknown', null, data.errorText, err.options.uri, null);
};
