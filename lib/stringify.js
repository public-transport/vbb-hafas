'use strict'

const moment = require('moment-timezone')
const util = require('vbb-util')

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



module.exports = {
	date, time,
	products, bike, accessibility
}
