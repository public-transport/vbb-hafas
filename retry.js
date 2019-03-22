'use strict'

const createClient = require('hafas-client')
const withRetrying = require('hafas-client/retry')
const vbbProfile = require('hafas-client/p/vbb')

const createRetryingClient = (userAgent, retryOpts = {}) => {
	return withRetrying(createClient, retryOpts)(vbbProfile, userAgent)
}

module.exports = createRetryingClient
