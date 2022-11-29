import {inspect} from 'util'
import {createVbbHafas as createHafas} from './index.js'
// import {createThrottledHafas} from './throttle.js'
// import {createHafasWithRetry} from './retry.js'

const hafas = createHafas('vbb-hafas-example')
// const hafas = createThrottledHafas('vbb-hafas-example', 5, 100)
// const hafas = createHafasWithRetry('vbb-hafas-example', {retries: 2})

const spichernstr = '900042101'
const bismarckstr = '900024201'

let data = await hafas.journeys(spichernstr, bismarckstr, {
	results: 1,
	tickets: true,
	stopovers: true,
	transferInfo: true,
	polylines: true,
})

// {
// 	const [journey] = data.journeys
// 	data = await hafas.refreshJourney(journey.refreshToken, {
// 		stopovers: true,
// 		transferInfo: true,
// 	})
// }

// {
// 	const [journey] = data.journeys
// 	const leg = journey.legs[0]
// 	data = await hafas.trip(leg.tripId, leg.line.name, {polyline: true})
// }

// let data = await hafas.departures('spichernstr', {duration: 1})
// let data = await hafas.arrivals('spichernstr', {duration: 10, linesOfStops: true})

// let data = await hafas.locations('spichernstr', {results: 2})
// let data = await hafas.nearby({
// 	type: 'location',
// 	latitude: 52.5137344,
// 	longitude: 13.4744798
// }, {distance: 60})
// let data = await hafas.reachableFrom({
// 	type: 'location',
// 	address: '13353 Berlin-Wedding, Torfstr. 17',
// 	latitude: 52.541797,
// 	longitude: 13.350042
// }, {
// 	when: new Date('2018-08-27T10:00:00+0200'),
// 	maxDuration: 10
// })
// let data = await hafas.stop(spichernstr, {linesOfStops: true})

// let data = await hafas.radar({
// 	north: 52.52411,
// 	west: 13.41002,
// 	south: 52.51942,
// 	east: 13.41709
// }, {results: 10})

console.log(inspect(data, {depth: null, colors: true}))
