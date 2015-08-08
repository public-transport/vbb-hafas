var apiErrors =		require('vbb-util').apiErrors;





var e = module.exports = {};



e.ConnectionError = function (code, message, url, method) {
	Error.call(this, message);
	this.code =			code;
	this.message =		message;
	this.url =			url;
	this.method =		method;
};

e.ConnectionError.prototype = Object.create(Error.prototype);
e.ConnectionError.prototype.constructor = e.ConnectionError;

e.ConnectionError.prototype.toString = function () {
	return 'connection error: ' + this.code + ' ' + this.message;
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
