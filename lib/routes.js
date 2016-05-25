'use strict'

const util = require('vbb-util')
const request = require('./request')



const defaults = {
	results:        5,
	passedStations: false,
	tickets:        false,
	products: {
		suburban:       true,
		subway:         true,
		tram:           true,
		bus:            true,
		ferry:          true,
		express:        true,
		regional:       true
	}
}

const routes = (from, to, opt) => {
	if ('number' !== typeof from) throw new Error('from must be a number.')
	if ('number' !== typeof to)   throw new Error('to must be a number.')

	opt = opt || {}
	opt.products = Object.assign({}, defaults.products, opt.products)
	opt = Object.assign({}, defaults, opt)
	const products = util.products.stringifyBitmask(opt.products)

	return request({
		  cfg: {polyEnc: 'GPA'}
		, meth: 'TripSearch'
		, req: {
			  outDate: '20160525'
			, outTime: '011331'
			, numF: opt.results
			, getTariff: opt.tickets
			, getPasslist: opt.passedStations
			, arrLocL: [{type: 'S', lid: 'L=' + from}]
			, depLocL: [{type: 'S', lid: 'L=' + to}]
			, jnyFltrL: [{
				  type:  'PROD'
				, mode:  'INC'
				, value: products.toString()
			}]

			// todo: what is indoor, baimInfom?
			, indoor: false, getPolyline: false, baimInfo: false
			// todo: what is outFrwd, getPT, getEco?
			, outFrwd: true, getPT: true, getEco: false
			// todo: what is getIV, getTrainComposition, ushrp?
			, getIV: false, getTrainComposition: false, ushrp: false
			, minChgTime: 0 // todo: expose as an option
		}
	})
}

module.exports = routes
