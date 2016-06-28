'use strict'

const stringify = require('hafas-client/stringify')
const util = require('vbb-util')



const date = (when) => stringify.date('Europe/Berlin', when)
const time = (when) => stringify.time('Europe/Berlin', when)



const products = (data) => ({
	  type: 'PROD'
	, mode: 'INC'
	, value: util.products.stringifyBitmask(data).toString()
})



module.exports = {date, time, products}
