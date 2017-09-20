'use strict'

const isValidId = (id) => {
	if (!id || 'string' !== typeof id) return false
	id = id.trim()
	const l = id.length
	return (l === 7 || l === 9 || l === 12) && /^[0-9_]+$/.test(id)
}

module.exports = {isValidId}
