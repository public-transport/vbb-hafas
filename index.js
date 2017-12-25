'use strict'

const createClient = require('hafas-client')
const vbbProfile = require('hafas-client/p/vbb')

const client = createClient(vbbProfile)

module.exports = client
