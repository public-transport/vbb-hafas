'use strict'

const stringify = require('./stringify')
const request = require('./request')
const parse = require('./parse')
const shorten = require('vbb-short-station-name')



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

const location = (l) => {
	if ('number' === typeof l) return stringify.station(l)
	else if ('object' === typeof l) {
		if (l.type === 'poi')
			return stringify.poi(l.latitude, l.longitude, l.id, l.name)
		else if (l.type === 'address')
			return stringify.address(l.latitude, l.longitude, l.name)
		else throw new Error('invalid location.')
	}
	else throw new Error('valid station, address or poi required.')
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
	// todo: planning period d.fpB, d.fpE
	.then((d) => Array.isArray(d.outConL)
		? d.outConL
			.map(parse.route(d.locations, d.products, d.remarks))
			.map((r) => {r.parts = r.parts.map((p) => {
				p.from.name = shorten(p.from.name)
				p.to.name = shorten(p.to.name)
				return p
			}); return r})
		: []
	, (err) => err)
}

module.exports = routes
