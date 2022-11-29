import _profileHooks from 'hafas-client/lib/profile-hooks.js'
const {parseHook} = _profileHooks
import createClient from 'hafas-client'
import vbbProfile from 'hafas-client/p/vbb/index.js'
import colors from 'vbb-line-colors'

import {addTransferInfoToJourney} from './lib/add-transfer-info.js'

const {parseLine: _parseLine} = vbbProfile
const parseLineWithColor = ({parsed}, l) => {
	const {product, name} = parsed
	const c = colors[product] && colors[product][name]
	if (c) parsed.color = c

	return parsed
}

const customVbbProfile = {
	...vbbProfile,
	parseLine: parseHook(_parseLine, parseLineWithColor)
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
	const refreshJourneyWithTransfers = (refreshToken, opt = {}) => {
		if (opt && opt.transferInfo) opt.stopovers = true
		const p = origRefreshJourney(refreshToken, opt)

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

export {
	defaults,
	createVbbHafas,
}
