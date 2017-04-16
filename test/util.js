'use strict'

const stations = require('vbb-stations-autocomplete')
const {isValidId} = require('../lib/helpers')
const floor = require('floordate')
const isRoughlyEqual = require('is-roughly-equal')



const findStation = (name) => stations(name, 1, false, false)[0]

const isValidCoordinates = (c) =>
	   c
	&& 'number' === typeof c.latitude
	&& 'number' === typeof c.longitude

const isValidStation = (s) =>
	   s.type === 'station'
	&& isValidId(s.id)
	&& s.id.length === 12
	&& 'string' === typeof s.name
	&& s.name.indexOf('(Berlin)') === -1
	&& findStation(s.name)
	&& isValidCoordinates(s.coordinates)

const isValidPoi = (p) =>
	   p.type === 'poi'
	&& isValidId(p.id)
	&& 'string' === typeof p.name
	&& isValidCoordinates(s.coordinates)

const isValidAddress = (p) =>
	   p.type === 'address'
	&& 'string' === typeof p.name
	&& isValidCoordinates(s.coordinates)

const isValidLocation = (l) =>
	   isValidStation(l)
	|| isValidPoi(l)
	|| isValidAddress(l)

const isValidMode = (m) =>
	   m === 'walking'
	|| m === 'train'
	|| m === 'bus'
	|| m === 'ferry'

const isValidLine = (l) =>
	   l.line === 'line'
	&& isValidId(l.id)
	&& 'string' === typeof l.name
	&& isValidMode(l.mode)
	&& 'string' === typeof l.product
	&& 'number' === typeof l.nr
	&& 'boolean' === typeof l.metro
	&& 'boolean' === typeof l.express
	&& 'boolean' === typeof l.night
	// todo
	// && 'object' === typeof l.type

// todo
// const isValidStop = (s) =>
// 	   s.arrival instanceof Date
// 	&& s.departure instanceof Date
// 	&& isValidStation(s.station)



const minute = 60 * 1000
const hour = 60 * minute
const when = new Date(+floor(new Date(), 'day') + 10 * hour)
const isValidWhen = isRoughlyEqual(2 * hour, +when)



module.exports = {
	isValidCoordinates, isValidStation, isValidPoi, isValidAddress, isValidLocation,
	isValidMode, isValidLine,
	minute, hour, when, isValidWhen
}
