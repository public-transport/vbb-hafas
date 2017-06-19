'use strict'

const shorten = require('vbb-short-station-name')

const stringify = require('./stringify')
const request = require('./request')
const parse = require('./parse')



const tz = 'Europe/Berlin'

const journeyPartDetails = (ref, lineName, opt = {}) => {
	opt.when = opt.when || new Date()

	return request({
		  cfg: {polyEnc: 'GPA'}
		, meth: 'JourneyDetails'
		, req: {
			jid: ref,
	        name: lineName,
	        date: stringify.date(opt.when)
		}
	})
	// todo: planning period d.fpB, d.fpE
	.then((d) => {
		const res = parse.journeyPartDetails(tz, d.locations, d.lines, d.remarks)(d.journey)

		for (let stopover of res.passed) {
			stopover.station.name = shorten(stopover.station.name)
		}

		return res
	})
}

module.exports = journeyPartDetails
