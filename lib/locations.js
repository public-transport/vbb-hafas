'use strict'

const request = require('./request')
const util = require('vbb-util')
const parse = require('./parse')



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
	console.log(type)

	return request({
		  cfg: {polyEnc: 'GPA'}
		, meth: 'LocMatch'
		, req: {input: {
			  loc: {type, name: opt.fuzzy ? query + '?' : query}
			, maxLoc: opt.results
			, field: 'S' // todo: what is this?
		}}
	})
	.then((data) => {
		// todo: what is locL[…].state? 'M', 'A', 'F'
		if (!data.match || !data.match.locL) return []
		return data.match.locL.map(parse.location)
	}, (err) => {console.error(err.stack); return err})
	.catch(console.error)
}

module.exports = locations
