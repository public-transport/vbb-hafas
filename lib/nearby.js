'use strict'

const request = require('./request')
const parse = require('./parse')
const padR = require('pad-right')



const coord = (v) => parseInt(padR(('' + v).replace('.', ''), 8, '0').slice(0, 8))

const defaults = {
	results:  8, // maximum number of results
	distance: null, // maximum walking distance in meters
	poi:      false, // return points of interest?
	stations: true, // return stations?
}



const departures = (latitude, longitude, opt) => {
	if ('number' !== typeof latitude) throw new Error('latitude must be a number.')
	latitude = +('' + latitude).replace('.', '')
	if ('number' !== typeof longitude) throw new Error('longitude must be a number.')
	longitude = +('' + longitude).replace('.', '')
	opt = Object.assign({}, defaults, opt || {})

	return request({
		  cfg: {polyEnc: 'GPA'}
		, meth: 'LocGeoPos'
		, req: {
			  ring: {
				  cCrd: {x: coord(longitude), y: coord(latitude)}
				, maxDist: opt.distance ? -1 : opt.distance
				, minDist: 0
			}
			, getPOIs: opt.poi
			, getStops: opt.stations
			, maxLoc: opt.results
		}
	})
	.then((data) => {
		if (!data.locL) return []
		return data.locL.map(parse.nearby)
	}, (err) => {console.error(err.stack); return err})
}

module.exports = departures
