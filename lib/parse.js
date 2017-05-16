'use strict'

const parse = require('hafas-client/parse')
const util = require('vbb-util')
const omit = require('lodash.omit')
const parseLineName = require('vbb-parse-line')
const oldToNew = require('vbb-translate-ids/old-to-new.json')



const modes = [
	'train',
	'train',
	'train', // see public-transport/friendly-public-transport-format#4
	'bus',
	'ferry',
	'train',
	'train',
	null
]

const modesByClass = []
modesByClass[1] = modes[0]
modesByClass[2] = modes[1]
modesByClass[4] = modes[2] // see public-transport/friendly-public-transport-format#4
modesByClass[8] = modes[3]
modesByClass[16] = modes[4]
modesByClass[32] = modes[5]
modesByClass[64] = modes[6]

const line = (p) => {
	const r = parse.line(p)
	if (!r) return null
	if ('productCode' in r) {
		r.productCode = parseInt(r.productCode)
		r.product = util.products.categories[r.productCode].type
		r.mode = modes[r.productCode]
	} else if (r.class) {
		r.product = util.products.bitmasks[r.class].type
		r.mode = modesByClass[r.class]
	}
	if (r.name) {
		const l = parseLineName(r.name)
		Object.assign(r, omit(l, ['type', '_']))
		if (!r.product) r.product = util.products[l.type].type
	}
	return r
}

const route = (l, p, r) => {
	const parseRoute = parse.route('Europe/Berlin', l, p, r)
	return (r) => {
		const res = parseRoute(r)
		if (!res) return null

		// console.error(res.parts)
		// if ('productCode' in r) r.type =
		// 	util.products.categories[parseInt(r.productCode)]
		// if (p.prodCtx && p.prodCtx.line) {
		// 	const l = line(p.prodCtx.line)
		// 	r.line = l._
		// 	Object.assign(r, omit(l, ['type', '_']))
		// }
		return res
	}
}

const location = (l) => {
	const r = parse.location(l)
	if ('products' in r) r.products = util.products.parseBitmask(r.products)
	if (r.id) r.id = oldToNew[r.id] || (r.id + '')
	return r
}

const nearby = (l) => {
	const r = parse.nearby(l)
	r.id = oldToNew[r.id] || (r.id + '')
	return r
}

module.exports = {line, route, location, nearby}
