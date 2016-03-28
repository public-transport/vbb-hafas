'use strict'

const a              = require('assert')
const isRoughlyEqual = require('is-roughly-equal')
const stations       = require('vbb-stations-autocomplete')

const hafas          = require('./index.js')

a.ok(process.env.VBB_API_KEY && process.env.VBB_API_KEY.length > 0,
	'No VBB API key set. Please add an env variable `VBB_API_KEY')
const key = process.env.VBB_API_KEY

// fixtures
const when = new Date('Mon Mar 28 2016 19:53:42 GMT+0200 (CEST)')
const halfAnHour = 30 * 60 * 1000



// test for hafas.departures
hafas.departures(key, 9042101, { // U Spichernstr.
	  results: 4
	, when
}).then((deps) => {
	a.ok(Array.isArray(deps), 'does not resolve with an array')
	a.strictEqual(deps.length, 4)

	for (let dep of deps) {

		a.strictEqual(dep.stop, 9042101) // id from query

		a.ok('type' in dep, 'Missing type property.')

		a.ok('direction' in dep, 'Missing direction property.')
		a.ok(stations(dep.direction, 1).length > 0,
			'The direction property seems to be wrong')

		a.ok('when' in dep, 'Missing when property.')
		a.ok(isRoughlyEqual(halfAnHour, dep.when, when), 'Departure time seems to be far off.')
	}
})
