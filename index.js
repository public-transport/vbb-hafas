'use strict'

const hafas = (cache) => ({
	  routes:     require('./lib/routes')(cache)
	, departures: require('./lib/departures')(cache)
})

const redisCache = require('./lib/cache')
module.exports = Object.assign(hafas(redisCache), {hafas})
