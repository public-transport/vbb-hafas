'use strict'

const url       = require('url')
const path      = require('path')
const request   = require('request-promise')
const apiErrors = require('vbb-util').apiErrors
const co        = require('co')
const shorthash = require('shorthash')



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

const query = co.wrap(function* (service, params, cache, ttl) {
	let target = url.parse(endpoint, true)
	target.pathname     = path.join(target.pathname, service)
	target.query.format = 'json'
	target.query.lang   = 'en'
	Object.assign(target.query, params)

	const key = service + '-' + shorthash.unique(JSON.stringify(params))
	const cached = yield cache.get(key)
	if (cached) return JSON.parse(cached)

	const data = yield request(url.format(target), {json: true})
		.then(onSuccess, (err) => {
			if (err.response && err.response.body) return err.response.body
			return err
		})

	if (ttl > 0) {
		yield cache.set(key, JSON.stringify(data))
		yield cache.expire(key, Math.round(ttl/1000))
	}
	return data
})

module.exports = query
