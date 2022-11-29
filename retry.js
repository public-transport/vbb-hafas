import {createClient} from 'hafas-client'
import {withRetrying} from 'hafas-client/retry.js'
import {profile as vbbProfile} from 'hafas-client/p/vbb/index.js'

const createRetryingClient = (userAgent, opt = {}) => {
	const {retryOpts} = {retryOpts: {}, ...opt}

	const retryingProfile = withRetrying(vbbProfile, retryOpts)
	return createClient(retryingProfile, userAgent, opt)
}

export {
	createRetryingClient,
}
