'use strict'

const a = require('assert')
const isRoughlyEqual = require('is-roughly-equal')
const stations = require('vbb-stations-autocomplete')
const floor = require('floordate')

const {
	isValidStation, isValidPoi, isValidAddress, isValidLocation,
	isValidLine,
	hour, when, isValidWhen
} = require('./util')

const hafas = require('.')

const onError = (err) => {
	console.error(err.stack || err.message)
	process.exit(1)
}



// U Spichernstr. to U Amrumer Str.
hafas.routes('900000042101', '900000009101', {
	results: 3, when, passedStations: true
})
.then((routes) => {
	a.ok(Array.isArray(routes))
	a.strictEqual(routes.length, 3)
	for (let route of routes) {

		a.ok(isValidStation(route.from))
		a.ok(route.from.name.indexOf('(Berlin)') === -1)
		a.strictEqual(route.from.id, '900000042101')
		a.ok(isValidWhen(route.start))

		a.ok(isValidStation(route.to))
		a.strictEqual(route.to.id, '900000009101')
		a.ok(isValidWhen(route.end))

		a.ok(Array.isArray(route.parts))
		a.strictEqual(route.parts.length, 1)
		const part = route.parts[0]

		a.ok(isValidStation(part.from))
		a.ok(part.from.name.indexOf('(Berlin)') === -1)
		a.strictEqual(part.from.id, '900000042101')
		a.ok(isValidWhen(part.start))

		a.ok(isValidStation(part.to))
		a.strictEqual(part.to.id, '900000009101')
		a.ok(isValidWhen(part.end))

		a.ok(isValidLine(part.product))
		a.ok(findStation(part.direction))
		a.ok(part.direction.indexOf('(Berlin)') === -1)

		a.ok(Array.isArray(part.passed))
		for (let stop of part.passed) a.ok(isValidStop(stop))
	}
})
.catch(onError)



// U Spichernstr. to Torfstraße 17
hafas.routes('900000042101', {
	type: 'address', name: 'Torfstraße 17',
	latitude: 52.5416823, longitude: 13.3491223
}, {results: 1, when})
.then((routes) => {
	a.ok(Array.isArray(routes))
	a.strictEqual(routes.length, 1)
	const route = routes[0]
	const part = route.parts[route.parts.length - 1]

	a.ok(isValidStation(part.from))
	a.ok(isValidWhen(part.start))

	a.ok(isValidAddress(part.to))
	a.strictEqual(part.to.name, 'Torfstr. 17')
	a.ok(isRoughlyEqual(.0001, part.to.latitude, 52.5416823))
	a.ok(isRoughlyEqual(.0001, part.to.longitude, 13.3491223))
	a.ok(isValidWhen(part.end))

})
.catch(onError)



// U Spichernstr. to ATZE Musiktheater
hafas.routes('900000042101', {
	type: 'poi', name: 'ATZE Musiktheater', id: 9980720,
	latitude: 52.543333, longitude: 13.351686
}, {results: 1, when})
.then((routes) => {
	a.ok(Array.isArray(routes))
	a.strictEqual(routes.length, 1)
	const route = routes[0]
	const part = route.parts[route.parts.length - 1]

	a.ok(isValidStation(part.from))
	a.ok(isValidWhen(part.start))

	a.ok(isValidPoi(part.to))
	a.strictEqual(part.to.name, 'ATZE Musiktheater')
	a.ok(isRoughlyEqual(.0001, part.to.latitude, 52.543333))
	a.ok(isRoughlyEqual(.0001, part.to.longitude, 13.351686))
	a.ok(isValidWhen(part.end))

})
.catch(onError)



hafas.departures('900000042101', {duration: 5, when}) // U Spichernstr.
.then((deps) => {
	a.ok(Array.isArray(deps))
	a.deepEqual(deps, deps.sort((a, b) => a.when > b.when))
	for (let dep of deps) {

		a.equal(dep.station.name, 'U Spichernstr.')
		a.ok(isValidStation(dep.station))
		a.strictEqual(dep.station.id, '900000042101')

		a.ok(isValidWhen(dep.when))
		a.ok(findStation(dep.direction))
		a.ok(isValidLine(dep.product))
	}
})
.catch(onError)



hafas.nearby(52.4873452,13.3310411, {results: 2, distance: 400}) // Berliner Str./Bundesallee
.then((nearby) => {
	a.ok(Array.isArray(nearby))
	a.strictEqual(nearby.length, 2)

	a.ok(isValidLocation(nearby[0]))
	a.equal(nearby[0].id, '900000044201')
	a.equal(nearby[0].name, 'U Berliner Str.')
	a.ok(nearby[0].distance > 0)
	a.ok(nearby[0].distance < 100)

	a.ok(isValidLocation(nearby[1]))
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
	a.ok(locations.every(isValidLocation))
	a.ok(locations.find(isValidStation))
	a.ok(locations.find(isValidPoi))
	a.ok(locations.find(isValidAddress))
})
.catch(onError)



hafas.radar(52.52411, 13.41002, 52.51942, 13.41709)
.then((vehicles) => {
	a.ok(Array.isArray(vehicles))
	a.ok(vehicles.length > 0)
	for (let v of vehicles) {

		// a.ok(findStation(v.direction)) todo
		a.ok(isValidLine(v.product))

		a.equal(typeof v.latitude, 'number')
		a.ok(v.latitude <= 52.52411, 'vehicle is outside bounding box')
		a.ok(v.latitude >= 52.51942, 'vehicle is outside bounding box')
		a.equal(typeof v.longitude, 'number')
		a.ok(v.longitude >= 13.41002, 'vehicle is outside bounding box')
		a.ok(v.longitude <= 13.41709, 'vehicle is outside bounding box')

		a.ok(Array.isArray(v.nextStops))
		for (let s of v.nextStops) {
			a.ok(isValidStation(s.station))
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
			// a.ok(isValidStation(f.from))
			// a.ok(isValidStation(f.to))
			a.equal(typeof f.t, 'number')
		}
	}
})
.catch(onError)
