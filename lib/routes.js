'use strict'

const util = require('vbb-util')
const got  = require('got')



const defaults = {
	results:        5,
	passedStations: false,
	tickets:        false,
	products: {
		suburban:       true,
		subway:         true,
		tram:           true,
		bus:            true,
		ferry:          true,
		express:        true,
		regional:       true
	}
}

const request = (from, to, opt) => {
	if ('number' !== typeof from) throw new Error('from must be a number.')
	if ('number' !== typeof to)   throw new Error('to must be a number.')

	opt = opt || {}
	opt.products = Object.assign({}, defaults.products, opt.products)
	opt = Object.assign({}, defaults, opt)
	const products = util.products.stringifyBitmask(opt.products)

return got.post('http://fahrinfo.vbb.de/bin/mgate.exe', {
	json: true,
	headers: {
		'Content-Type':    'application/json',
		'Accept-Encoding': 'gzip, deflate'
	},
	body: JSON.stringify({
		  client: {type: 'IPA', id: 'BVG'}, ext: 'VBB.2', ver: '1.11'
		, auth: {type: 'AID', aid: 'hafas-vbb-apps'}
		, lang: 'en' // lang can be 'de'/'en'
		, svcReqL: [{
			  cfg: {polyEnc: 'GPA'}
			, meth: 'TripSearch'
			, req: {
				  outDate: '20160525'
				, outTime: '011331'
				, numF: opt.results
				, getTariff: opt.tickets
				, getPasslist: opt.passedStations
				, arrLocL: [{type: 'S', lid: 'L=' + from}]
				, depLocL: [{type: 'S', lid: 'L=' + to}]
				, jnyFltrL: [
					{type: 'PROD', mode: 'INC', value: products.toString()},
					// todo: expose as an option
					{type: 'META', mode: 'INC', meta: 'notBarrierfree'}
				]

				// todo: what is indoor, baimInfom?
				, indoor: false, getPolyline: false, baimInfo: false
				// todo: what is outFrwd, getPT, getEco?
				, outFrwd: true, getPT: true, getEco: false
				// todo: what is getIV, getTrainComposition, ushrp?
				, getIV: false, getTrainComposition: false, ushrp: false
				, minChgTime: 0 // todo: expose as an option
			}
		}]
	})
})
.catch((err) => err)
.then((res) => {
	if (!res.body.svcResL || !res.body.svcResL[0])
		return new Error('invalid response')
	const data = res.body.svcResL[0]
	if (data.err !== 'OK') return new Error(data.errTxt)
	return data.res
})
}

module.exports = request
