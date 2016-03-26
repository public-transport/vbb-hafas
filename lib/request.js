'use strict'

const url     = require('url')
const path    = require('path')
const request = require('request-promise')



const endpoint = 'http://demo.hafas.de/openapi/vbb-proxy/'

const unknownError = new Error('unknown api error')
const apiError = (res, data) => {
	const group = apiErrors[data.errorCode.substr(0, 1)]
	if (!group) return unknownError
	const err = group[parseInt(data.errorCode.substr(1))]
	if (!err) return unknownError
	return Object.assign(new Error(err.message), {
		code: err.code,
		url:  res.request.url
	})
}



const onSuccess = (res) => {
	res = res[0]
	if (res.statusCode < 200 || res.statusCode >= 300)
		throw new Error('Connection error.')
	try { res = JSON.parse(res.body) }
	catch (e) { throw new Error('Could not parse JSON.') }
	if (data.errorCode) throw apiError(res, data)
	return data
}

const query = (service, params) => {
	let target = url.parse(endpoint, true)
	target.pathname     = path.join(target.pathname, service)
	target.query.format = 'json'
	target.query.lang   = 'en'
	Object.assign(target.query, params)

	return request(url.format(target)).then(onSuccess)
}

module.exports = query
