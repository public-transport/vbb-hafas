'use strict'

// todo: make this a lib

const getChangePositions = require('vbb-change-positions')
const merged = require('merged-vbb-stations')

// by prevStation-fromStation-toStation-nextStation signature
const changePositions = Object.create(null)

const importTask = new Promise((resolve, reject) => {
	getChangePositions()
	.on('data', (item) => {
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
	})
	.once('error', reject)
	.once('end', () => resolve())
})
importTask.catch(() => {})

// Synchronous iteration might become a problem in the future, as
// `vbb-change-positions` might contain thousands of entries.
// todo: make it async

const addTransferInfoToJourney = (j) => {
	// There may be walking legs in between.
	// todo: still show where to get off
	for (let i = 0; i < (j.legs.length - 1); i++) {
		const fromL = j.legs[i]
		if (!fromL.line || !fromL.line.public || !fromL.passed) continue
		const toL = j.legs[i + 1]
		if (!toL.line || !toL.line.public || !toL.passed) continue

		const fromS = merged[fromL.destination.id]
		if (!fromS) continue
		const fromT = fromL.arrivalPlatform

		const fromIndex = fromL.passed.findIndex((p) => {
			return p.station && p.station.id === fromL.destination.id
		})
		let prev = fromL.passed[fromIndex - 1]
		prev = prev && prev.station && prev.station.id
		if (!prev) continue

		const toS = merged[toL.origin.id]
		if (!toS) continue
		const toT = toL.departurePlatform

		const toIndex = toL.passed.findIndex((p) => {
			return p.station && p.station.id === toL.origin.id
		})
		let next = toL.passed[toIndex + 1]
		next = next && next.station && next.station.id
		if (!next) continue

		const sig = [prev, fromS, toS, next].join('-')
		if (!Array.isArray(changePositions[sig])) continue
		for (let item of changePositions[sig]) {
			if (fromT && item.fromTrack && fromT !== item.fromTrack) continue
			if (toT && item.toTrack && toT !== item.toTrack) continue
			// todo: respect item.fromLines, item.toLines

			fromL.arrivalPosition = item.fromPosition
			toL.departurePosition = item.toPosition
			break
		}
	}
}

// todo: this is ugly, build something cleaner
addTransferInfoToJourney.import = importTask
module.exports = addTransferInfoToJourney
