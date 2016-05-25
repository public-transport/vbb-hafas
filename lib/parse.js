'use strict'

const util = require('vbb-util')
const line = require('vbb-parse-line')
const omit = require('lodash.omit')



const date = (s) =>
	new Date(s.substr(0, 4), s.substr(4, 2), s.substr(6, 2), 0, 0, 0, 0)

const time = (s) =>
	            1000 * s.substr(4, 2)
	+      60 * 1000 * s.substr(2, 2)
	+ 60 * 60 * 1000 * s.substr(0, 2)



// todo: what is s.rRefL?
const station = (s) => ({
	  id:        parseInt(s.extId)
	, name:      s.name
	, latitude:  s.crd.x / 1000000
	, longitude: s.crd.y / 1000000
})



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
	const guess = line(p.prodCtx.line)
	if (guess.type === result.type.type)
		Object.assign(result, omit(guess, ['type', '_']))
	return result
}



const remark = (r) => null // todo: vbb-parse-remarks



// s = stations, p = products, r = remarks, c = connection
const stop = (s, p, r, c) => (st) => {
	const result = {station:   s[parseInt(st.locX)]}
	if (st.aTimeS) result.arrival =
		new Date(+date(c.date) + time(st.aTimeS))
	if (st.dTimeS) result.departure =
		new Date(+date(c.date) + time(st.dTimeS))
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
		, start:     new Date(+date(c.date) + time(pt.dep.dTimeS))
		, end:       new Date(+date(c.date) + time(pt.arr.aTimeS))
		, product:   p[parseInt(pt.jny.prodX)]
		, direction: pt.jny.dirTxt
		, stops:     pt.jny.stopL.map(stop(s, p, r, c))
	}
	pt.jny.remL.forEach(applyRemark(s, p, r, c))
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



module.exports = {
	date, time,
	station, product, remark,
	stop, applyRemark, part, route
}
