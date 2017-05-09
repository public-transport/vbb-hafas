'use strict'

const a = require('assert')
const isRoughlyEqual = require('is-roughly-equal')
const stations = require('vbb-stations-autocomplete')
const floor = require('floordate')

const {
	assertValidStation,
	assertValidPoi,
	assertValidAddress,
	assertValidLocation,
	assertValidLine,
	assertValidPassed,
	hour, when,
	assertValidWhen
} = require('./util')

const hafas = require('..')

const onError = (err) => {
	console.error(err.stack || err.message)
	process.exit(1)
}

const findStation = (query) => stations(query, true, false)



// U Spichernstr. to U Amrumer Str.
hafas.journeys('900000042101', '900000009101', {
	results: 3, when, passedStations: true
})
.then((journeys) => {
	a.ok(Array.isArray(journeys))
	a.strictEqual(journeys.length, 3)

	for (let journey of journeys) {

		assertValidStation(journey.origin)
		a.ok(journey.origin.name.indexOf('(Berlin)') === -1)
		a.strictEqual(journey.origin.id, '900000042101')
		assertValidWhen(journey.departure)

		assertValidStation(journey.destination)
		a.strictEqual(journey.destination.id, '900000009101')
		assertValidWhen(journey.arrival)

		a.ok(Array.isArray(journey.parts))
		a.strictEqual(journey.parts.length, 1)
		const part = journey.parts[0]

		assertValidStation(part.origin)
		a.ok(part.origin.name.indexOf('(Berlin)') === -1)
		a.strictEqual(part.origin.id, '900000042101')
		assertValidWhen(part.departure)

		assertValidStation(part.destination)
		a.strictEqual(part.destination.id, '900000009101')
		assertValidWhen(part.arrival)

		// assertValidLine(part.product) // todo
		a.ok(findStation(part.direction))
		a.ok(part.direction.indexOf('(Berlin)') === -1)

		a.ok(Array.isArray(part.passed))
		for (let passed of part.passed) assertValidPassed(passed)
	}
})
.catch(onError)



// U Spichernstr. to Torfstraße 17
hafas.journeys('900000042101', {
	type: 'address', name: 'Torfstraße 17',
	latitude: 52.5416823, longitude: 13.3491223
}, {results: 1, when})
.then((journeys) => {
	a.ok(Array.isArray(journeys))
	a.strictEqual(journeys.length, 1)
	const journey = journeys[0]
	const part = journey.parts[journey.parts.length - 1]

	assertValidStation(part.origin)
	assertValidWhen(part.departure)

	assertValidAddress(part.destination)
	a.strictEqual(part.destination.name, 'Torfstr. 17')
	a.ok(isRoughlyEqual(.0001, part.destination.latitude, 52.5416823))
	a.ok(isRoughlyEqual(.0001, part.destination.longitude, 13.3491223))
	assertValidWhen(part.arrival)

})
.catch(onError)



// U Spichernstr. to ATZE Musiktheater
hafas.journeys('900000042101', {
	type: 'poi', name: 'ATZE Musiktheater', id: 9980720,
	latitude: 52.543333, longitude: 13.351686
}, {results: 1, when})
.then((journeys) => {
	a.ok(Array.isArray(journeys))
	a.strictEqual(journeys.length, 1)
	const journey = journeys[0]
	const part = journey.parts[journey.parts.length - 1]

	assertValidStation(part.origin)
	assertValidWhen(part.departure)

	assertValidPoi(part.destination)
	a.strictEqual(part.destination.name, 'ATZE Musiktheater')
	a.ok(isRoughlyEqual(.0001, part.destination.latitude, 52.543333))
	a.ok(isRoughlyEqual(.0001, part.destination.longitude, 13.351686))
	assertValidWhen(part.arrival)

})
.catch(onError)



hafas.departures('900000042101', {duration: 5, when}) // U Spichernstr.
.then((deps) => {
	a.ok(Array.isArray(deps))
	a.deepEqual(deps, deps.sort((a, b) => a.when > b.when))
	for (let dep of deps) {

		a.equal(dep.station.name, 'U Spichernstr.')
		assertValidStation(dep.station)
		a.strictEqual(dep.station.id, '900000042101')

		assertValidWhen(dep.when)
		a.ok(findStation(dep.direction))
		// assertValidLine(dep.product) // todo
	}
})
.catch(onError)



hafas.nearby(52.4873452,13.3310411, {results: 2, distance: 400}) // Berliner Str./Bundesallee
.then((nearby) => {
	a.ok(Array.isArray(nearby))
	a.strictEqual(nearby.length, 2)

	assertValidLocation(nearby[0])
	a.equal(nearby[0].id, '900000044201')
	a.equal(nearby[0].name, 'U Berliner Str.')
	a.ok(nearby[0].distance > 0)
	a.ok(nearby[0].distance < 100)

	assertValidLocation(nearby[1])
	a.equal(nearby[1].id, '900000043252')
	a.equal(nearby[1].name, 'Landhausstr.')
	a.ok(nearby[1].distance > 100)
	a.ok(nearby[1].distance < 200)
})
.catch(onError)



hafas.locations('Alexanderplatz', {results: 10})
.then((locations) => {
	a.ok(Array.isArray(locations))
	a.ok(locations.length > 0)
	a.ok(locations.length <= 10)
	for (let l of locations) assertValidLocation(l)
	a.ok(locations.find((s) => s.type === 'station'))
	a.ok(locations.find((s) => s.type === 'poi'))
	a.ok(locations.find((s) => s.type === 'address'))
})
.catch(onError)



hafas.radar(52.52411, 13.41002, 52.51942, 13.41709)
.then((vehicles) => {
	a.ok(Array.isArray(vehicles))
	a.ok(vehicles.length > 0)
	for (let v of vehicles) {

		a.ok(findStation(v.direction)) // todo
		// assertValidLine(v.product) // todo

		a.equal(typeof v.coordinates.latitude, 'number')
		a.ok(v.coordinates.latitude <= 52.52411, 'vehicle is outside bounding box')
		a.ok(v.coordinates.latitude >= 52.51942, 'vehicle is outside bounding box')
		a.equal(typeof v.coordinates.longitude, 'number')
		a.ok(v.longitude >= 13.41002, 'vehicle is outside bounding box')
		a.ok(v.longitude <= 13.41709, 'vehicle is outside bounding box')

		a.ok(Array.isArray(v.nextStops))
		for (let s of v.nextStops) {
			assertValidStation(s.station)
			if (!s.arrival && !s.departure)
				a.ifError(new Error('neither arrival nor departure return'))
			if (s.arrival) {
				a.ok(s.arrival instanceof Date)
				a.ok(isRoughlyEqual(+s.arrival, Date.now(), 2 * hour))
			}
			if (s.departure) {
				a.ok(s.departure instanceof Date)
				a.ok(isRoughlyEqual(+s.departure, Date.now(), 2 * hour))
			}
		}

		a.ok(Array.isArray(v.frames))
		for (let f of v.frames) {
			// todo, see derhuerst/vbb-hafas#14
			// assertValidStation(f.origin)
			// assertValidStation(f.destination)
			a.equal(typeof f.t, 'number')
		}
	}
})
.catch(onError)
