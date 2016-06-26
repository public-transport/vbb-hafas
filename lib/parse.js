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

module.exports = {product}
