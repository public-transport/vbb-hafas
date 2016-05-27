'use strict'

const util = require('vbb-util')
const request = require('./request')
const parse = require('./parse')



const stringifyToDate = (when) => ''
	+ when.getFullYear()
	+ ('0' + (1 + when.getMonth())).slice(-2)
	+ ('0' + when.getDate()).slice(-2)

const stringifyToTime = (when) => ''
	+ ('0' + when.getHours()).slice(-2)
	+ ('0' + when.getMinutes()).slice(-2)
	+ ('0' + when.getSeconds()).slice(-2)

const defaults = {
	direction:    null, // only show departures heading to this station
	// todo: find option for absolute number of results
	duration:     10, // show departures for the next n minutes
	products: {
		suburban: true,
		subway:   true,
		tram:     true,
		bus:      true,
		ferry:    true,
		express:  true,
		regional: true
	}
}



const routes = (station, opt) => {
	if ('number' !== typeof station) throw new Error('station must be a number.')

	opt = opt || {}
	opt.products = Object.assign({}, defaults.products, opt.products)
	opt = Object.assign({}, defaults, opt)
	opt.when = opt.when || new Date()

	return request({
		  cfg: {polyEnc: 'GPA'}
		, meth: 'StationBoard'
		, req: {
			  date: stringifyToDate(opt.when)
			, time: stringifyToTime(opt.when)
			, stbLoc: {type: 'S', lid: 'L=' + station}
			, dirLoc: opt.direction
				? {type: 'S', lid: 'L=' + opt.direction} : null
			, dur: opt.duration
	        , getPasslist: false
		}
	})
	.then((data) => {
		// todo: planning period data.fpB, data.fpE
		const stations = data.common.locL.map(parse.station)
		const products = data.common.prodL.map(parse.product)
		const remarks  = data.common.remL.map(parse.remark)
		return data.jnyL.map(parse.departure(stations, products, remarks))
		return data
	}, (err) => {console.error(err.stack); return err})
}

module.exports = routes
