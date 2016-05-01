'use strict'

const url       = require('url')
const path      = require('path')
const request   = require('request-promise')
const apiErrors = require('vbb-util').apiErrors



const endpoint = 'http://demo.hafas.de/openapi/vbb-proxy/'

const unknownError = new Error('unknown api error')



const onSuccess = (data) => {
	if (data.errorCode) {
		const group = apiErrors[data.errorCode.substr(0, 1)]
		if (!group) return unknownError
		const err = group[parseInt(data.errorCode.substr(1))]
		if (!err) return unknownError
		throw Object.assign(new Error(err.message), {code: err.code})
	} else return data
}

const query = (service, params) => {
	let target = url.parse(endpoint, true)
	target.pathname     = path.join(target.pathname, service)
	target.query.format = 'json'
	target.query.lang   = 'en'
	Object.assign(target.query, params)

	return request(url.format(target), {json: true})
}
		.catch((err) => {
			if (err.response && err.response.body) return err.response.body
			return err
		})
		.then(onSuccess)

module.exports = query
