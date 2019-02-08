'use strict'

const createClientWithRetry = require('hafas-client/retry')
const vbbProfile = require('hafas-client/p/vbb')

const withRetry = (userAgent, retryOpts = {}) => {
	return createClientWithRetry(vbbProfile, userAgent, retryOpts)
}

module.exports = withRetry
