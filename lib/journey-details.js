'use strict'

const stringify = require('./stringify')
const request = require('./request')
const parse = require('./parse')
// const {isValidId} = require('./helpers')
// const _stringify = require('./stringify')



const tz = 'Europe/Berlin'

const journeyDetails = (ref, lineName, opt = {}) => {
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
		return parse.journeyDetails(tz, d.locations, d.lines, d.remarks)(d.journey)
	})
}

module.exports = journeyDetails
