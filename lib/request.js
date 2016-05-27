'use strict'

const got  = require('got')

const request = (data) =>
	got.post('http://fahrinfo.vbb.de/bin/mgate.exe', {
		json: true,
		headers: {
			'Content-Type':    'application/json',
			'Accept-Encoding': 'gzip, deflate'
		},
		body: JSON.stringify({
			  client: {type: 'IPA', id: 'BVG'}, ext: 'VBB.2', ver: '1.11'
			, auth: {type: 'AID', aid: 'hafas-vbb-apps'}
			, lang: 'en' // lang can be 'de'/'en'
			, svcReqL: [data]
		})
	})
	.catch((err) => err)
	.then((res) => {
		if (res.body.err || !res.body.svcResL || !res.body.svcResL[0])
			return new Error('invalid response')
		const data = res.body.svcResL[0]
		if (data.err !== 'OK') return new Error(data.errTxt)
		return data.res
	})

module.exports = request
