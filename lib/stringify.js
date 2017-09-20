'use strict'

const {to9Digit} = require('vbb-translate-ids')
const stringify = require('hafas-client/stringify')
const util = require('vbb-util')



const date = (when) => stringify.date('Europe/Berlin', when)
const time = (when) => stringify.time('Europe/Berlin', when)



const products = (data) => ({
	  type: 'PROD'
	, mode: 'INC'
	, value: util.products.stringifyBitmask(data).toString()
})



const station = (id) => {
	if ('string' === typeof id && id.length !== 7) id = to9Digit(id)
	return stringify.station(id)
}

module.exports = {date, time, products, station}
