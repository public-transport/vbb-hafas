const apiErrors = require('vbb-util').apiErrors



const ConnectionError = (code, message, url, method) => Object.assign(
	new Error(message),
	{code, message, url, method})

ConnectionError.prototype = Object.create(Error.prototype)
ConnectionError.prototype.constructor = ConnectionError
ConnectionError.prototype.toString = function () {
	return `connection error: ${this.code} ${this.message}`
}



const ApiServerError = (type, code, message, url, details) =>
	Object.assign(new Error(message), {type, code, message, url,
		statusCode: code}) // http status code

ApiServerError.prototype = Object.create(Error.prototype)
ApiServerError.prototype.constructor = ApiServerError
ApiServerError.prototype.toString = function () {
	return `API server error: ${this.code} – ${this.message} (${this.url})`
}

const apiServerError = function (res, data) {
	const unknownError = new ApiServerError('unknown', null, data.errorText, res.request.url, null)
	const group = apiErrors[data.errorCode.substr(0, 1)]
	if (!group) return unknownError
	const error = group[parseInt(data.errorCode.substr(1))]
	if (!error) return unknownError
	return new ApiServerError(group.name, error.code, error.message, res.request.url, data.errorText)
}



module.exports = {ConnectionError, ApiServerError, apiServerError}
