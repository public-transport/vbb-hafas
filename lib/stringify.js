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
const station = (id) => ({type: 'S', lid: 'L=' + id})
const address = (latitude, longitude, name) => {
	if (!latitude || !longitude || !name) throw new Error('invalid address.')
	return {type: 'A', name, crd: {x: coord(longitude), y: coord(latitude)}}
}
const poi = (latitude, longitude, id, name) => {
	if (!latitude || !longitude || !id || !name) throw new Error('invalid poi.')
	return {type: 'P', name, lid: 'L=' + id, crd: {x: coord(longitude), y: coord(latitude)}}
}



module.exports = {
	date, time,
	products, bike, accessibility,
	coord, station, address, poi
}
