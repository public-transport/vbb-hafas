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



const station = (id) => stringify.station(to9Digit(id))



module.exports = {date, time, products, station}
