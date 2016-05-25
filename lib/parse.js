'use strict'

const util = require('vbb-util')
const line = require('vbb-parse-line')





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



module.exports = {
	station, product, remark,
}
