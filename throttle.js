'use strict'

const createClient = require('hafas-client')
const withThrottling = require('hafas-client/throttle')
const vbbProfile = require('hafas-client/p/vbb')

const createThrottledClient = (userAgent, limit = 5, interval = 1000) => {
	return withThrottling(createClient, limit, interval)(vbbProfile, userAgent)
}

module.exports = createThrottledClient
