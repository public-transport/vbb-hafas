'use strict'

const parse = require('hafas-client/parse')
const util = require('vbb-util')
const omit = require('lodash.omit')
const line = require('vbb-parse-line')



const product = (p) => {
	const r = parse.product(p)
	if (!r) return null
	if ('productCode' in r) r.type =
		util.products.categories[parseInt(r.productCode)]
	if (p.prodCtx && p.prodCtx.line) {
		const l = line(p.prodCtx.line)
		r.line = l._
		Object.assign(r, omit(l, ['type', '_']))
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
	return r
}

module.exports = {product, route, location}
