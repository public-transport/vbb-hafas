import getStations from 'vbb-stations'
import assert from 'assert'

import {addTransferInfoToJourney} from '../lib/add-transfer-info.js'

const kotti = getStations('900000013102')[0]
const prinzenstr = getStations('900000013103')[0]
const halleschesTor = getStations('900000012103')[0]
const mehringdamm = getStations('900000017101')[0]
const kottiDep = '2018-05-05T05:05:00.000+02:00'
const halleschesTorArr = '2018-05-05T05:08:00.000+02:00'
const halleschesTorDep = '2018-05-05T05:12:00.000+02:00'
const mehringdammArr = '2018-05-05T05:13:00.000+02:00'

const a = {
	id: '123|234|345|456|567',
	origin: kotti,
	departure: kottiDep,
	departurePlatform: '3', // this is imaginary
	departureDelay: 30,
	destination: halleschesTor,
	arrival: halleschesTorArr,
	arrivalPlatform: '2', // this is imaginary
	arrivalDelay: 0,
	line: {
		type: 'line',
		id: '123',
		name: 'U1',
		public: true,
		mode: 'train',
		product: 'subway'
	},
	direction: 'U Uhlandstr.',
	stopovers: [{
		stop: kotti,
		arrival: null,
		departure: kottiDep
	}, {
		stop: prinzenstr,
		arrival: '2018-05-05T05:06:00.000+02:00',
		departure: '2018-05-05T05:07:00.000+02:00'
	}, {
		stop: halleschesTor,
		arrival: halleschesTorArr,
		departure: halleschesTorArr
	}]
}

const b = {
	id: '321|432|543|654|765',
	origin: halleschesTor,
	departure: halleschesTorDep,
	departurePlatform: '4', // this is imaginary
	departureDelay: null,
	destination: mehringdamm,
	arrival: mehringdammArr,
	arrivalPlatform: '3', // this is imaginary
	arrivalDelay: 0,
	line: {
		type: 'line',
		id: '321',
		name: 'U6',
		public: true,
		mode: 'train',
		product: 'subway'
	},
	direction: 'U Alt-Mariendorf',
	stopovers: [{
		stop: halleschesTor,
		arrival: null,
		departure: halleschesTorDep
	}, {
		stop: mehringdamm,
		arrival: mehringdammArr,
		departure: mehringdammArr
	}]
}

const j = {
	legs: [a, b]
}

addTransferInfoToJourney(j)
// in the back, leading to the stairs
assert.strictEqual(a.bestArrivalPosition, 0.3)
// in the front, coming from the stairs
assert.strictEqual(b.departurePosition, 1)
