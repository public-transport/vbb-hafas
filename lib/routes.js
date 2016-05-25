'use strict'

const got   = require('got')



const request = () =>
got.post('http://fahrinfo.vbb.de/bin/mgate.exe', {
	json: true,
	headers: {
		'Content-Type':    'application/json',
		'Accept-Encoding': 'gzip, deflate'
	},
	body: JSON.stringify({
		  client: {type: 'IPA', id: 'BVG'} // type can be 'VBB'/'BVG'
		, lang: 'en' // lang can be 'de'/'en'
		, ext: 'VBB.2'
		, ver: '1.11'
		, svcReqL: [{
			  cfg: {polyEnc: 'GPA'}
			, meth: 'TripSearch'
			, req: {
				  indoor: false
				, getPolyline: true
				, baimInfo: false
				, outFrwd: true
				, getPT: true
				, outDate: '20160525'
				, outTime: '011331'
				, jnyFltrL: [
					{type: 'PROD', mode: 'INC', value: '127'},
					{type: 'META', mode: 'INC', meta: 'notBarrierfree'}
				]
				, getEco: false
				, minChgTime: 0
				, numF: 3
				, getTariff: true
				, getPasslist: true
				, arrLocL: [{
					  type: 'S'
					, lid:  'A=1@O=Kastanienallee (Berlin)@X=13272231@Y=52519512@U=86@L=009020152@B=1@V=3.9,@p=1464074247@'
					, name: 'Kastanienallee (Berlin)'
				}]
				, depLocL: [{
					  type: 'S'
					, lid:  'A=1@O=Ahrensfelde, Kirschenallee@X=13579015@Y=52581906@U=86@L=009350138@B=1@V=3.9,@p=1464074247@'
					, name: 'Ahrensfelde, Kirschenallee'
				}]
				, getIV: false
				, getTrainComposition: false
				, ushrp: false
			}
		}]
		, auth: {type: 'AID', aid: 'hafas-vbb-apps'} // required, otherwise svcReqL will be empty
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

module.exports = request
