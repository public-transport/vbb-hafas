'use strict'

const a = require('assert')
const stations = require('vbb-stations-autocomplete')
const {isValidId} = require('../lib/helpers')
const floor = require('floordate')
const isRoughlyEqual = require('is-roughly-equal')



const findStation = (name) => stations(name, 1, false, false)[0]

const assertValidCoordinates = (t, c) => {
	t.ok(c)
	t.strictEqual(typeof c.latitude, 'number')
	t.strictEqual(typeof c.longitude, 'number')
}

const assertValidStation = (t, s, onlyNewIds = true) => {
	t.strictEqual(s.type, 'station')
	t.ok(isValidId(s.id))
	if (onlyNewIds) t.strictEqual(s.id.length, 12)
	t.strictEqual(typeof s.name, 'string')
	t.strictEqual(s.name.indexOf('(Berlin)'), -1)
	t.ok(findStation(s.name))
	assertValidCoordinates(t, s.coordinates)
}

const assertValidPoi = (t, p) => {
	t.strictEqual(p.type, 'poi')
	t.ok(isValidId(p.id))
	t.strictEqual(typeof p.name, 'string')
	assertValidCoordinates(t, p.coordinates)
}

const assertValidAddress = (t, addr) => {
	t.strictEqual(addr.type, 'address')
	t.strictEqual(typeof addr.name, 'string')
	assertValidCoordinates(t, addr.coordinates)
}

const assertValidLocation = (t, l, onlyNewIds = true) => {
	if (l.type === 'station') assertValidStation(t, l, onlyNewIds)
	else if (l.type === 'poi') assertValidPoi(t, l)
	else if (l.type === 'address') assertValidAddress(t, l)
	else t.ifError(new Error('invalid location type'))
}

const assertValidPassed = (t, p) => {
	assertValidStation(t, p.station)
	if (p.arrival) assertValidWhen(t, p.arrival)
	if (p.departure) assertValidWhen(t, p.departure)
}

const isValidMode = (m) =>
	   m === 'walking'
	|| m === 'train'
	|| m === 'bus'
	|| m === 'ferry'

const assertValidLine = (t, l) => {
	t.strictEqual(l.type, 'line')
	t.okEqual(isValidId(l.id))
	t.strictEqual(typeof l.name, 'string')
	t.ok(isValidMode(l.mode))
	t.strictEqual(typeof l.product, 'string')
	t.strictEqual(typeof l.nr, 'number')
	t.strictEqual(typeof l.metro, 'boolean')
	t.strictEqual(typeof l.express, 'boolean')
	t.strictEqual(typeof l.night, 'boolean')
	// todo
	// t.strictEqual(ypeof l.type, 'object')
}



const minute = 60 * 1000
const hour = 60 * minute
const when = new Date(+floor(new Date(), 'day') + 10 * hour)

const assertValidWhen = (t, w) => {
	t.ok(isRoughlyEqual(2 * hour, +when, w))
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
