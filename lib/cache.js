'use strict'

const redis = require('then-redis')

const cache = redis.createClient()
cache.on('error', console.error)
module.exports = cache
