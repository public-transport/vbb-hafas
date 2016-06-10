'use strict'

const stringify = require('./stringify')
const request = require('./request')
const parse = require('./parse')



const defaults = {
	results:        5, // how many routes?
	via:            null, // let routes pass this station
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

const location = (x) => {
	if ('number' === typeof x) return stringify.station(x)
	else if ('object' === typeof x) {
		if (x.latitude && x.longitude && x.name)
			return stringify.address(x.latitude, x.longitude, x.name)
		else throw new Error('invalid address.')
	}
	else throw new Error('valid station of address required.')
}



const routes = (from, to, opt) => {
	from = location(from)
	to = location(to)

	opt = opt || {}
	opt.products = Object.assign({}, defaults.products, opt.products)
	opt = Object.assign({}, defaults, opt)
	opt.when = opt.when || new Date()

	const filters = [
		  stringify.products(opt.products)
		, stringify.accessibility[opt.accessibility]
	]
	if (opt.bike) filters.push(stringify.bike)
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
			, depLocL: [from]
			, viaLocL: opt.via ? [{loc: {type: 'S', lid: 'L=' + opt.via}}] : null
			, arrLocL: [to]
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
		const locations = data.common.locL.map(parse.location)
		const products = data.common.prodL.map(parse.product)
		const remarks  = data.common.remL.map(parse.remark)
		return data.outConL.map(parse.route(locations, products, remarks))
	}, (err) => {console.error(err.stack); return err})
}

module.exports = routes
