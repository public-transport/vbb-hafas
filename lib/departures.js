'use strict'

const util    = require('vbb-util')
const request = require('./request')



const defaults = {
	results:   6,
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



const onSuccess = (data) => {
	if (!data || !data.Departure) return []
	return data.Departure.map((dep) => {
		let r = {
			stop:      parseInt(dep.stopExtId),
			type:      util.products.parseCategory(dep.Product.catCode).type,
			direction: dep.direction,
			when:      util.dateTime.parse(dep.date, dep.time)
		}

		if (dep.type === util.products.express.type)
			r.line = dep.Product.line // fixes #8
		if (dep.rtDate && dep.rtTime)
			dep.realtime = util.dateTime.parse(dep.rtDate, dep.rtTime)
		// todo: notes

		return r
	})
}

const departures = (key, station, opt) => {
	if ('string' !== typeof key)
		throw new Error('API key must be a string.')
	if (!station) throw new Error('Station missing.')
	opt = Object.assign({}, defaults, opt)
	if (!opt.when) opt.when = new Date()

	let params = {
		id:          util.locations.stations.stringifyId(station),
		maxJourneys: opt.results,
		date:        util.dateTime.stringifyToDate(opt.when),
		time:        util.dateTime.stringifyToTime(opt.when),
		products:    util.products.stringifyBitmask(opt.products),
		accessId:    key
	}
	if (opt.direction) params.direction =
		util.locations.stations.stringifyId(opt.direction)

	return request('departureBoard', params).then(onSuccess)
}



module.exports = departures
