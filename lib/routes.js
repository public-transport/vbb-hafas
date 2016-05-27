'use strict'

const util = require('vbb-util')
const stringify = require('./stringify')
const request = require('./request')
const parse = require('./parse')



const defaults = {
	results:        5, // how many routes?
	passedStations: false, // return stations on the way?
	transfers:      5, // maximum of 5 transfers
	transferTime:   0, // minimum time for a single transfer in minutes
	accessibility:  'none', // 'none', 'partial' or 'complete'
	bike:           false, // only bike-friendly routes
	products: {
		suburban:   true,
		subway:     true,
		tram:       true,
		bus:        true,
		ferry:      true,
		express:    true,
		regional:   true
	}
}

// filters
const products = (data) => ({
	  type: 'PROD'
	, mode: 'INC'
	, value: util.products.stringifyBitmask(data).toString()
})
const bike = {type: 'BC', mode: 'INC'}
const accessibility = {
	  none:     {type: 'META', mode: 'INC', meta: 'notBarrierfree'}
	, partial:  {type: 'META', mode: 'INC', meta: 'limitedBarrierfree'}
	, complete: {type: 'META', mode: 'INC', meta: 'completeBarrierfree'}
}



const routes = (from, to, opt) => {
	if ('number' !== typeof from) throw new Error('from must be a number.')
	if ('number' !== typeof to)   throw new Error('to must be a number.')

	opt = opt || {}
	opt.products = Object.assign({}, defaults.products, opt.products)
	opt = Object.assign({}, defaults, opt)

	opt.when = opt.when || new Date()

	const filters = [products(opt.products), accessibility[opt.accessibility]]
	if (opt.bike) filters.push(bike)
	// todo: add req.gisFltrL

	return request({
		  cfg: {polyEnc: 'GPA'}
		, meth: 'TripSearch'
		, req: {
			  outDate: stringify.date(opt.when)
			, outTime: stringify.time(opt.when)
			, numF: opt.results
			, getPasslist: opt.passedStations
			, maxChg: opt.transfers
			, minChgTime: opt.transferTime
			, arrLocL: [{type: 'S', lid: 'L=' + from}]
			, depLocL: [{type: 'S', lid: 'L=' + to}]
			, jnyFltrL: [filters]
			, getPT: true, outFrwd: true

			, getTariff: false // todo
			, getIV: false // walk & bike as alternatives?
			, getPolyline: false // shape for displaying on a map?
			// todo: what is indoor, baimInfom?
			, indoor: false, baimInfo: false
		}
	})
	.then((data) => {
		// todo: planning period data.fpB, data.fpE
		const stations = data.common.locL.map(parse.station)
		const products = data.common.prodL.map(parse.product)
		const remarks  = data.common.remL.map(parse.remark)
		return data.outConL.map(parse.route(stations, products, remarks))
	}, (err) => {console.error(err.stack); return err})
}

module.exports = routes
