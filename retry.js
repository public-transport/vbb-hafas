'use strict'

const createClient = require('hafas-client')
const withRetrying = require('hafas-client/retry')
const vbbProfile = require('hafas-client/p/vbb')

const createRetryingClient = (userAgent, opt = {}) => {
	const {retryOpts} = {retryOpts: {}, ...opt}

	const retryingProfile = withRetrying(vbbProfile, retryOpts)
	return createClient(retryingProfile, userAgent, opt)
}

module.exports = createRetryingClient
