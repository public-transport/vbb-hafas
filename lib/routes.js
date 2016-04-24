'use strict'

const util      = require('vbb-util')
const parseLine = require('vbb-parse-line')
const request   = require('./request')



const defaults = {
	results:            5,
	transferTimeFactor: 1,
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



const parsePart = (p) => {
	let r = {
		from:      util.locations.parse(p.Origin),
		start:     util.dateTime.parse(p.Origin.date, p.Origin.time),
		to:        util.locations.parse(p.Destination),
		end:       util.dateTime.parse(p.Destination.date, p.Destination.time),
		transport: util.lines.legs.types.parse(p.type).type
	}

	if (p.Notes) r.notes = util.lines.legs.notes.parse(p.Notes)
	if (r.transport === 'public') {
		r.type = util.products.parseCategory(p.Product.catCode).type
		r.line = parseLine(p.Product.line)
		r.direction = p.direction // todo: fix #11
	}

	return r
}

const parseTickets = (data) => {
	if (!data) return null
	try { return util.lines.fares.parse(data.fareSetItem[0].fareItem[0].ticket) }
	catch (e) { return null }
}

const parseRoute = (route) => ({
	duration: util.duration.parse(route.duration),
	parts:    (route.LegList.Leg || []).map(parsePart),
	tickets:  parseTickets(route.TariffResult)
	// todo: `leg.Messages`? are they actually being used?
	// todo: `leg.ServiceDays`?
})

const onSuccess = (data) => {
	if (!data || !data.Trip) return []
	let results = []

	return results.concat(data.Trip.map(parseRoute))
}



const routes = (key, from, to, opt) => {
	if ('string' !== typeof key)
		throw new Error('API key must be a string.')
	opt = Object.assign({}, defaults, opt)
	if (!opt.when) opt.when = new Date()

	let params = {
		changeTimePercent: Math.round(opt.transferTimeFactor * 100),
		date:              util.dateTime.stringifyToDate(opt.when),
		time:              util.dateTime.stringifyToTime(opt.when),
		numF:              Math.min(opt.results, 6),
		numB:              0, // wat
		products:          util.products.stringifyBitmask(opt.products),
		accessId:          key
	}
	if ('number' === typeof opt.changes) params.maxChange = opt.changes

	if (Array.isArray(from)) {
		params.originCoordLat  = from[0]
		params.originCoordLong = from[1]
	} else if (from) params.originId = '' + from
	else throw new Error('`from` argument missing.')
	if (Array.isArray(to)) {
		params.destCoordLat  = to[0]
		params.destCoordLong = to[1]
	} else if (to) params.destId = '' + to
	else throw new Error('`to` argument missing.')

	return request('trip', params).then(onSuccess)
}



module.exports = routes
