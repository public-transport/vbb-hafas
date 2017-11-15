'use strict'

const {isValidId} = require('./helpers')
const stringify = require('./stringify')
const request = require('./request')
const parse = require('hafas-client/parse')
const shorten = require('vbb-short-station-name')



const defaults = {
	direction: null, // only show departures heading to this station
	// todo: find option for absolute number of results
	duration:  10 // show departures for the next n minutes
}



const departures = (station, opt) => {
	if (!isValidId(station)) throw new Error('station invalid.')
	opt = Object.assign({}, defaults, opt || {})
	opt.when = opt.when || new Date()

	return request({
		  cfg: {polyEnc: 'GPA'}
		, meth: 'StationBoard'
		, req: {
        	  type: 'DEP'
			, date: stringify.date(opt.when)
			, time: stringify.time(opt.when)
			, stbLoc: stringify.station(station)
			, dirLoc: opt.direction
				? {type: 'S', lid: 'L=' + opt.direction} : null
			, dur: opt.duration
	        , getPasslist: false
		}
	})
	// todo: planning period d.fpB, d.fpE
	.then((d) => {
		return Array.isArray(d.jnyL)
		? d.jnyL
			.map(parse.departure('Europe/Berlin', d.locations, d.lines, d.remarks))
			.map((dep) => {
				dep.station.name = shorten(dep.station.name)
				dep.direction = shorten(dep.direction)
				return dep
			})
			.sort((a, b) => new Date(a.when) - new Date(b.when))
		: []
	})
}

module.exports = departures
