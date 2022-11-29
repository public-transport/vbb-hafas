import {inspect} from 'util'
import {createVbbHafas as createHafas} from './index.js'
// import {createThrottledHafas} from './throttle.js'
// import {createHafasWithRetry} from './retry.js'

const hafas = createHafas('vbb-hafas-example')
// const hafas = createThrottledHafas('vbb-hafas-example', 5, 100)
// const hafas = createHafasWithRetry('vbb-hafas-example', {retries: 2})

const spichernstr = '900000042101'
const bismarckstr = '900000024201'

hafas.journeys(spichernstr, bismarckstr, {
	results: 1,
	tickets: true,
	stopovers: true,
	transferInfo: true,
	polylines: true,
})
// .then(({journeys}) => {
// 	const [journey] = journeys
// 	return hafas.refreshJourney(journey.refreshToken, {
// 		stopovers: true,
// 		transferInfo: true,
// 	})
// })
// .then(({journeys}) => {
// 	const [journey] = journeys
// 	const leg = journey.legs[0]
// 	return hafas.trip(leg.tripId, leg.line.name, {polyline: true})
// })

// hafas.departures('spichernstr', {duration: 1})
// hafas.arrivals('spichernstr', {duration: 10, linesOfStops: true})

// hafas.locations('spichernstr', {results: 2})
// hafas.nearby({
// 	type: 'location',
// 	latitude: 52.5137344,
// 	longitude: 13.4744798
// }, {distance: 60})
// hafas.reachableFrom({
// 	type: 'location',
// 	address: '13353 Berlin-Wedding, Torfstr. 17',
// 	latitude: 52.541797,
// 	longitude: 13.350042
// }, {
// 	when: new Date('2018-08-27T10:00:00+0200'),
// 	maxDuration: 10
// })
// hafas.stop(spichernstr, {linesOfStops: true})

// hafas.radar({
// 	north: 52.52411,
// 	west: 13.41002,
// 	south: 52.51942,
// 	east: 13.41709
// }, {results: 10})

.then((data) => {
	console.log(require('util').inspect(data, {depth: null, colors: true}))
})
.catch((err) => {
	console.error(err)
	process.exitCode = 1
})
