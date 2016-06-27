'use strict'

const request = require('./request')
const strngfy = require('./stringify')
const parse = require('hafas-client/parse')
const shorten = require('vbb-short-station-name')



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
				  cCrd: {x: strngfy.coord(longitude), y: strngfy.coord(latitude)}
				, maxDist: opt.distance ? -1 : opt.distance
				, minDist: 0
			}
			, getPOIs: opt.poi
			, getStops: opt.stations
			, maxLoc: opt.results
		}
	})
	.then((d) => Array.isArray(d.locL)
		? d.locL.map(parse.nearby).map((n) => {n.name = shorten(n.name); return n})
		: []
	, (err) => err)
}

module.exports = departures
