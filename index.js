'use strict'

const createClient = require('hafas-client')
const vbbProfile = require('hafas-client/p/vbb')

const addTransferInfoToJourney = require('./lib/add-transfer-info')

const client = createClient(vbbProfile)

const origJourneys = client.journeys
const journeysWithTransfers = (from, to, opt = {}) => {
	if (opt && opt.transferInfo) opt.passedStations = true
	const p = origJourneys(from, to, opt)

	if (opt && opt.transferInfo) {
		return p.then((journeys) => {
			for (let journey of journeys) addTransferInfoToJourney(journey)
			return journeys
		})
	}
	return p
}
client.journeys = journeysWithTransfers

module.exports = client
