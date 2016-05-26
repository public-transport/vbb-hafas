'use strict'

const util = require('vbb-util')
const request = require('./request')



const stringifyToDate = (when) => ''
	+ when.getFullYear()
	+ ('0' + (1 + when.getMonth())).slice(-2)
	+ ('0' + when.getDate()).slice(-2)

const stringifyToTime = (when) => ''
	+ ('0' + when.getHours()).slice(-2)
	+ ('0' + when.getMinutes()).slice(-2)
	+ ('0' + when.getSeconds()).slice(-2)

const defaults = {
	results:        5,
	passedStations: false,
	tickets:        false,
	transfers:      5,
	transferTime:   0, // in minutes
	accessibility:  'none',
	bike:           false,
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
			  outDate: stringifyToDate(opt.when)
			, outTime: stringifyToTime(opt.when)
			, numF: opt.results
			, getTariff: opt.tickets
			, getPasslist: opt.passedStations
			, maxChg: opt.transfers
			, minChgTime: opt.transferTime
			, arrLocL: [{type: 'S', lid: 'L=' + from}]
			, depLocL: [{type: 'S', lid: 'L=' + to}]
			, jnyFltrL: [filters]
			, getPT: true, outFrwd: true

			, getIV: false // walk & bike as alternatives?
			, getPolyline: false // shape for displaying on a map?
			// todo: what is indoor, baimInfom?
			, indoor: false, baimInfo: false
		}
	})
}

module.exports = routes
