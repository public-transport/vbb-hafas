'use strict'

const request = require('./request')
const util = require('vbb-util')
const parse = require('./parse')
const shorten = require('vbb-short-station-name')



const defaults = {
	  fuzzy:     true // find only exact matches?
	, results:   10 // how many search results?
	, stations:  true
	, addresses: true
	, poi:       true // points of interest
}



const locations = (query, opt) => {
	if ('string' !== typeof query) throw new Error('query must be a string.')
	opt = Object.assign({}, defaults, opt || {})
	const type = util.locations.types.stringify(
		{station: opt.stations, address: opt.addresses, poi: opt.poi})

	return request({
		  cfg: {polyEnc: 'GPA'}
		, meth: 'LocMatch'
		, req: {input: {
			  loc: {type, name: opt.fuzzy ? query + '?' : query}
			, maxLoc: opt.results
			, field: 'S' // todo: what is this?
		}}
	})
	.then((d) => {
		if (!d.match || !Array.isArray(d.match.locL)) return []
		const ls = d.match.locL.map(parse.location)
		for (let l of ls) l.name = shorten(l.name)
		return ls
	}, (err) => {throw err})
}

module.exports = locations
