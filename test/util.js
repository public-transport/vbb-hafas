'use strict'

const a = require('assert')
const stations = require('vbb-stations-autocomplete')
const {isValidId} = require('../lib/helpers')
const floor = require('floordate')
const isRoughlyEqual = require('is-roughly-equal')



const findStation = (name) => stations(name, 1, false, false)[0]

const assertValidCoordinates = (c) => {
	a.ok(c)
	a.strictEqual(typeof c.latitude, 'number')
	a.strictEqual(typeof c.longitude, 'number')
}

const assertValidStation = (s) => {
	a.strictEqual(s.type, 'station')
	a.ok(isValidId(s.id))
	a.strictEqual(s.id.length, 12)
	a.strictEqual(typeof s.name, 'string')
	a.strictEqual(s.name.indexOf('(Berlin)'), -1)
	a.ok(findStation(s.name))
	assertValidCoordinates(s.coordinates)
}

const assertValidPoi = (p) => {
	a.strictEqual(p.type, 'poi')
	a.ok(isValidId(p.id))
	a.strictEqual(typeof p.name, 'string')
	assertValidCoordinates(p.coordinates)
}

const assertValidAddress = (addr) => {
	a.strictEqual(addr.type, 'address')
	a.strictEqual(typeof addr.name, 'string')
	assertValidCoordinates(addr.coordinates)
}

const assertValidLocation = (l) => {
	if (l.type === 'station') assertValidStation(l)
	else if (l.type === 'poi') assertValidPoi(l)
	else if (l.type === 'address') assertValidAddress(l)
	else throw new Error('invalid location type')
}

const assertValidPassed = (p) => {
	assertValidStation(p.station)
	if (p.arrival) assertValidWhen(p.arrival)
	if (p.departure) assertValidWhen(p.departure)
}

const isValidMode = (m) =>
	   m === 'walking'
	|| m === 'train'
	|| m === 'bus'
	|| m === 'ferry'

const assertValidLine = (l) => {
	a.strictEqual(l.type, 'line')
	a.okEqual(isValidId(l.id))
	a.strictEqual(typeof l.name, 'string')
	a.ok(isValidMode(l.mode))
	a.strictEqual(typeof l.product, 'string')
	a.strictEqual(typeof l.nr, 'number')
	a.strictEqual(typeof l.metro, 'boolean')
	a.strictEqual(typeof l.express, 'boolean')
	a.strictEqual(typeof l.night, 'boolean')
	// todo
	// a.strictEqual(ypeof l.type, 'object')
}



const minute = 60 * 1000
const hour = 60 * minute
const when = new Date(+floor(new Date(), 'day') + 10 * hour)

const assertValidWhen = (t) => {
	a.ok(isRoughlyEqual(2 * hour, +when, t))
}



module.exports = {
	assertValidStation,
	assertValidPoi,
	assertValidAddress,
	assertValidLocation,
	assertValidPassed,
	isValidMode,
	assertValidLine,
	minute, hour, when,
	assertValidWhen
}
