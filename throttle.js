'use strict'

const createThrottledClient = require('hafas-client/throttle')
const vbbProfile = require('hafas-client/p/vbb')

const throttle = (limit = 5, interval = 1000) => {
	return createThrottledClient(vbbProfile, limit, interval)
}

module.exports = throttle
