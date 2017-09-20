'use strict'

const parse = require('hafas-client/parse')
const util = require('vbb-util')
const omit = require('lodash.omit')
const parseLineName = require('vbb-parse-line')
const {to12Digit} = require('vbb-translate-ids')
const slugg = require('slugg')
const stations = require('vbb-stations')



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
	if (r.productCode) {
		r.productCode = parseInt(r.productCode)
		r.product = (util.products.categories[r.productCode] || {}).type || null
		r.mode = modes[r.productCode]
	} else if (r.class) {
		r.product = (util.products.bitmasks[r.class] || {}).type || null
		r.mode = modesByClass[r.class]
	}
	if (r.name) {
		r.id = slugg(r.name.trim())

		const l = parseLineName(r.name)
		if (l && l.type) {
			Object.assign(r, omit(l, ['type', '_']))
			if (!r.product) r.product = util.products[l.type].type
		}
	}
	return r
}

const journey = (l, p, r) => parse.journey('Europe/Berlin', l, p, r)

const leadingZeros = /^0+/

const location = (l) => {
	const r = parse.location(l)

	if (r.id) r.id = to12Digit(r.id.replace(leadingZeros, ''))
	if ('products' in r) r.products = util.products.parseBitmask(r.products)
	if (r.type === 'station' && !r.coordinates) {
		const [s] = stations(r.id)
		if (s) {
			r.coordinates = {
				latitude: s.coordinates.latitude,
				longitude: s.coordinates.longitude
			}
		}
	}
	return r
}

const nearby = (l) => {
	const r = parse.nearby(l)
	if (r.id) r.id = to12Digit(r.id.replace(leadingZeros, ''))
	if ('products' in r) r.products = util.products.parseBitmask(r.products)
	return r
}

// todo: pt.sDays
// todo: pt.dep.dProgType, pt.arr.dProgType
// todo: what is pt.jny.dirFlg?
// todo: how does pt.freq work?
// tz = timezone, s = stations, ln = lines, r = remarks
const journeyPart = (tz, s, ln, r) => (d) => {
	const result = {
		id: d.jid,
		line: ln[parseInt(d.prodX)],
		direction: d.dirTxt, // todo: parse this
		// todo: isPartCncl, isRchbl, poly
	}

	if (d.stopL) result.passed = d.stopL.map(parse.stopover(tz, s, ln, r, d))
	if (Array.isArray(d.remL)) d.remL.forEach(parse.applyRemark(s, ln, r))

	return result
}

module.exports = {line, journey, location, nearby, journeyPart}
