'use strict'

const isValidId = (id) => {
	if (!id || 'string' !== typeof id) return false
	id = id.trim()
	return /^[0-9_]+$/.test(id) && (id.length === 7 || id.length === 12)
}

module.exports = {isValidId}
