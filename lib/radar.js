'use strict'

const _stringify = require('./stringify')
const stringify = require('hafas-client/stringify')
const request = require('./request')
const parse = require('hafas-client/parse')
const shorten = require('vbb-short-station-name')



const defaults = {
	results: 256, // maximum number of vehicles
	duration: 30, // compute frames for the next n seconds
	frames: 3, // nr of frames to compute
}



const tz = 'Europe/Berlin'

const radar = (north, west, south, east, opt) => {
	if ('number' !== typeof north) throw new Error('north must be a number.')
	if ('number' !== typeof west) throw new Error('west must be a number.')
	if ('number' !== typeof south) throw new Error('south must be a number.')
	if ('number' !== typeof east) throw new Error('east must be a number.')
	opt = Object.assign({}, defaults, opt || {})
	opt.when = opt.when || new Date()

	return request({
		  meth: 'JourneyGeoPos'
		, req: {
			  maxJny: opt.results
			, onlyRT: false // todo: only realtime?
			, date: _stringify.date(opt.when)
			, time: _stringify.time(opt.when)
			, rect: {
				llCrd: {x: stringify.coord(west), y: stringify.coord(south)},
				urCrd: {x: stringify.coord(east), y: stringify.coord(north)}
			}
			, perSize: opt.duration * 1000
			, perStep: Math.round(opt.duration / Math.max(opt.frames, 1) * 1000)
			, ageOfReport: true // todo
			, jnyFltrL: [{type: 'PROD', mode: 'INC', value: '127'}] // todo
			, trainPosMode: 'CALC' // todo
		}
	})
	.then((d) => {
		if (!Array.isArray(d.jnyL)) return []
		for (let l of d.locations) {
			if (l.type === 'station') l.name = shorten(l.name)
		}

		const movements = d.jnyL.map(parse.movement(tz, d.locations, d.lines, d.remarks))
		for (let movement of movements) {
			movement.direction = shorten(movement.direction)
		}

		return movements
	}, (err) => {throw err})
}

module.exports = radar
