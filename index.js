'use strict'

const createClient = require('hafas-client')
const vbbProfile = require('hafas-client/p/vbb')

const addTransferInfoToJourney = require('./lib/add-transfer-info')

const createVbbHafas = (userAgent) => {
	const hafas = createClient(vbbProfile, userAgent)

	const origJourneys = hafas.journeys
	const journeysWithTransfers = (from, to, opt = {}) => {
		if (opt && opt.transferInfo) opt.stopovers = true
		const p = origJourneys(from, to, opt)

		if (opt && opt.transferInfo) {
			return p.then((journeys) => {
				for (let journey of journeys) addTransferInfoToJourney(journey)
				return journeys
			})
		}
		return p
	}
	hafas.journeys = journeysWithTransfers

	const origRefreshJourney = hafas.refreshJourney
	const refreshJourneyWithTransfers = (ref, opt = {}) => {
		if (opt && opt.transferInfo) opt.stopovers = true
		const p = origRefreshJourney(ref, opt)

		if (opt && opt.transferInfo) {
			return p.then(j => {
				addTransferInfoToJourney(j)
				return j
			})
		}
		return p
	}
	hafas.refreshJourney = refreshJourneyWithTransfers

	return hafas
}

module.exports = createVbbHafas
