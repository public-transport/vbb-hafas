'use strict'

const moment = require('moment-timezone')
const util = require('vbb-util')
const padR = require('pad-right')

const date = (when) =>
	moment(when).tz('Europe/Berlin').format('YYYYMMDD')
const time = (when) =>
	moment(when).tz('Europe/Berlin').format('HHmmss')



// filters
const products = (data) => ({
	  type: 'PROD'
	, mode: 'INC'
	, value: util.products.stringifyBitmask(data).toString()
})
const bike = {type: 'BC', mode: 'INC'}
const accessibility = {
	  none:     {type: 'META', mode: 'INC', meta: 'notBarrierfree'}
	, partial:  {type: 'META', mode: 'INC', meta: 'limitedBarrierfree'}
	, complete: {type: 'META', mode: 'INC', meta: 'completeBarrierfree'}
}



const coord = (v) => parseInt(padR(('' + v).replace('.', ''), 8, '0').slice(0, 8))



module.exports = {
	date, time,
	products, bike, accessibility,
	coord
}
