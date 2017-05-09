'use strict'

const parse = require('hafas-client/parse')
const util = require('vbb-util')
const omit = require('lodash.omit')
const line = require('vbb-parse-line')
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

const product = (p) => {
	const r = parse.product(p)
	if (!r) return null
	if ('productCode' in r) r.type =
		util.products.categories[parseInt(r.productCode)]
	if (r.line || r.name) {
		const l = line(r.line || r.name)
		r.line = l._
		Object.assign(r, omit(l, ['type', '_']))
		if (!r.type) r.type = util.products[l.type]
	}
	return r
}

const route = (l, p, r) => {
	const parseRoute = parse.route('Europe/Berlin', l, p, r)
	return (r) => {
		const res = parseRoute(r)
		if (!res) return null

		for (let p of res.parts) {
			if (p.product.productCode) {
				p.mode = modes[parseInt(p.product.productCode)]
			}
		}
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
	r.id = oldToNew[r.id] || r.id
	return r
}

module.exports = {product, route, location, nearby}
