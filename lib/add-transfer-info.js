// todo: use import assertions once they're supported by Node.js & ESLint
// https://github.com/tc39/proposal-import-assertions
import {createRequire} from 'module'
const require = createRequire(import.meta.url)

import merged from 'merged-vbb-stations'
import {matrix} from './matrix.js'
const rawChangePositions = require('vbb-change-positions/data.json')

// todo: make this a lib
// todo: add debug logging!

// by prevStation-fromStation-toStation-nextStation signature
const changePositions = Object.create(null)
for (const item of rawChangePositions) {
	const sig = [
		item.previousStation.id,
		item.fromStation.id,
		item.toStation.id,
		item.nextStation.id
	].join('-')

	if (!Array.isArray(changePositions[sig])) changePositions[sig] = []
	// todo: store in a more compact form
	// [fromLines, fromPosition, toLines, toPosition, samePlatform]
	changePositions[sig].push(item)
}

// Synchronous iteration might become a problem in the future, as
// `vbb-change-positions` might contain thousands of entries.
// todo: make it async

const isValidLeg = (l) => {
	return l.line && l.line.public && Array.isArray(l.stopovers)
}

const stopsMatch = (stopA, stopB) => (
	stopA.id === stopB.id ||
	(stopA.stop && stopA.stop.id === stopB.id) ||
	(stopB.stop && stopB.stop.id === stopA.id) ||
	(stopA.stop && stopB && stopA.stop.id === stopB.stop.id)
)

const stopIds = (stop) => [
	stop.id,
	stop.stop ? stop.stop.id : null // stations
].filter(id => id !== null)

const addTransferInfoToJourney = (j) => {
	// There may be walking legs in between.
	// todo: still show where to get off
	for (let i = 0; i < (j.legs.length - 1); i++) {
		const fromL = j.legs[i]
		const toL = j.legs[i + 1]
		if (!isValidLeg(fromL) || !isValidLeg(toL)) continue

		const fromS = {
			...(fromL.destination || {}),
			id: merged[fromL.destination.id] || fromL.destination.id
		}
		const fromStops = fromL.stopovers.map(stpvr => stpvr.stop)
		const fromIdx = fromStops.findIndex(s => stopsMatch(fromS, s))
		const prevS = fromStops[fromIdx - 1]
		if (!prevS) continue

		const toS = {
			...(toL.origin || {}),
			id: merged[toL.origin.id] || toL.origin.id
		}
		const toStops = toL.stopovers.map(stpvr => stpvr.stop)
		const toIdx = toStops.findIndex(s => stopsMatch(toS, s))
		const nextS = toStops[toIdx + 1]
		if (!nextS) continue

		const fromT = fromL.arrivalPlatform
		const toT = toL.departurePlatform

		const sigs = matrix(
			stopIds(prevS),
			stopIds(fromS),
			stopIds(toS),
			stopIds(nextS)
		).map(sig => sig.join('-'))
		const positions = sigs
		.map(sig => changePositions[sig])
		.find(res => Array.isArray(res))
		if (!positions) continue

		for (const item of positions) {
			if (fromT && item.fromTrack && fromT !== item.fromTrack) continue
			if (toT && item.toTrack && toT !== item.toTrack) continue
			// todo: respect item.fromLines, item.toLines

			fromL.bestArrivalPosition = item.fromPosition
			toL.departurePosition = item.toPosition
			break
		}
	}
}

export {
	addTransferInfoToJourney,
}
