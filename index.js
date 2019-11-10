'use strict'

const createClient = require('hafas-client')
const vbbProfile = require('hafas-client/p/vbb')
const colors = require('vbb-line-colors')

const addTransferInfoToJourney = require('./lib/add-transfer-info')

const {parseLine: _createParseLine} = vbbProfile
const createParseLine = (profile, opt, data) => {
	const parseLine = _createParseLine(profile, opt, data)

	const parseLineWithColor = (l) => {
		const res = parseLine(l)

		const c = colors[res.product] && colors[res.product][res.name]
		if (c) res.color = c

		return res
	}
	return parseLineWithColor
}

const customVbbProfile = {
	...vbbProfile,
	parseLine: createParseLine
}

const defaults = {
	profile: customVbbProfile
}

const createVbbHafas = (userAgent, opt = {}) => {
	const {profile} = {...defaults, ...opt}

	const hafas = createClient(profile, userAgent)

	const origJourneys = hafas.journeys
	const journeysWithTransfers = (from, to, opt = {}) => {
		if (opt && opt.transferInfo) opt.stopovers = true
		const p = origJourneys(from, to, opt)

		if (opt && opt.transferInfo) {
			return p.then((res) => {
				for (let journey of res.journeys) addTransferInfoToJourney(journey)
				return res
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

createVbbHafas.defaults = defaults
module.exports = createVbbHafas
