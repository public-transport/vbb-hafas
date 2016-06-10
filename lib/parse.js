'use strict'

const moment = require('moment-timezone')
const util = require('vbb-util')
const shorten = require('vbb-short-station-name')
const line = require('vbb-parse-line')
const omit = require('lodash.omit')



const dateTime = (date, time) => {
	let offset = 0 // in days
	if (time.length > 6) {
		offset = +time.slice(0, -6)
		time = time.slice(-6)
	}
	return moment.tz(date + 'T' + time, 'Europe/Berlin')
	.add(offset, 'days')
	.valueOf()
}



const types = {P: 'poi', S: 'station', A: 'address'}
// todo: what is s.rRefL?
const location = (l) => {
	const type = types[l.type] || 'unknown'
	const result = {type
		, latitude:  l.crd ? l.crd.y / 1000000 : null
		, longitude: l.crd ? l.crd.x / 1000000 : null
		, name:      shorten(l.name)
	}
	if (type === 'poi' || type === 'station') result.id = parseInt(l.extId)
	return result
}



// todo: what is p.number vs p.line?
// todo: what is p.icoX?
// todo: what is p.cls?
// todo: what is p.oprX?
const product = (p) => {
	if (!p.prodCtx) return null
	const result = {
		  line: p.prodCtx.line
		, type: util.products.categories[parseInt(p.prodCtx.catCode)]
	}
	Object.assign(result, omit(line(p.prodCtx.line), ['type', '_']))
	return result
}



const remark = (r) => null // todo: vbb-parse-remarks



// s = stations, p = products, r = remarks, c = connection
const stop = (s, p, r, c) => (st) => {
	const result = {station:   s[parseInt(st.locX)]}
	if (st.aTimeR || st.aTimeS) result.arrival =
		new Date(dateTime(c.date, st.aTimeR || st.aTimeS))
	if (st.dTimeR || st.dTimeS) result.departure =
		new Date(dateTime(c.date, st.dTimeR || st.dTimeS))
	return result
}

// todo: finish parseRemark first
// s = stations, p = products, r = remarks, c = connection
const applyRemark = (s, p, r, c) => (rm) => null

// todo: pt.sDays
// todo: pt.dep.dProgType, pt.arr.dProgType
// todo: what is pt.jny.dirFlg?
// todo: how does pt.freq work?
// s = stations, p = products, r = remarks, c = connection
const part = (s, p, r, c) => (pt) => {
	const result = {
		  from:      s[parseInt(pt.dep.locX)]
		, to:        s[parseInt(pt.arr.locX)]
		, start:     new Date(dateTime(c.date, pt.dep.dTimeR || pt.dep.dTimeS))
		, end:       new Date(dateTime(c.date, pt.dep.aTimeR || pt.arr.aTimeS))
	}
	if (pt.type === 'WALK') result.type = 'walking'
	else if (pt.type === 'JNY') {
		result.product = p[parseInt(pt.jny.prodX)]
		result.direction = pt.jny.dirTxt // todo: parse this
		if (pt.jny.stopL) result.passed = pt.jny.stopL.map(stop(s, p, r, c))
		pt.jny.remL.forEach(applyRemark(s, p, r, c))

		if (pt.jny.freq && pt.jny.freq.jnyL)
			result.alternatives = pt.jny.freq.jnyL
				.filter((a) => a.stopL[0].locX === pt.dep.locX)
				.map((a) => ({
					product: p[parseInt(a.prodX)],
					when:    new Date(dateTime(c.date, a.stopL[0].dTimeS))
				}))
	}
	return result
}

// todo: c.sDays
// todo: c.dep.dProgType, c.arr.dProgType
// todo: c.conSubscr
// todo: c.trfRes x vbb-parse-ticket
// todo: use computed information from part
// s = stations, p = products, r = remarks
const route = (s, p, r) => (c) => {
	const parts = c.secL.map(part(s, p, r, c))
	return {
		  parts
		, from:  parts[0].from
		, start: parts[0].start
		, to:    parts[parts.length - 1].to
		, end:   parts[parts.length - 1].end
	}
}

// todo: what is d.jny.dirFlg?
// todo: d.stbStop.dProgType
// todo: what is d.stbStop.dTimeR?
// s = stations, p = products, r = remarks
const departure = (s, p, r) => (d) => {
	const result = {
		  station:   s[parseInt(d.stbStop.locX)]
		, when:      new Date(dateTime(d.date, d.stbStop.dTimeR || d.stbStop.dTimeS))
		, direction: shorten(d.dirTxt) // todo: parse this
		, product:   p[parseInt(d.prodX)]
		, remarks:   d.remL ? d.remL.map((rm) => r[parseInt(rm.remX)]) : null
	}
	return result
}

// todo: remarks
// todo: products
// todo: what is s.pCls?
// todo: what is s.wt?
// todo: what is s.dur?
const nearby = (n) => {
	const result = location(n)
	result.distance = n.dist
	return result
}



module.exports = {
	dateTime,
	location, product, remark,
	stop, applyRemark, part, route,
	departure,
	nearby
}
