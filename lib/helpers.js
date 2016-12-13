'use strict'

const isValidId = (id) => {
	if (!id || ('string' !== typeof id && 'number' !== typeof id)) return false
	id = id.toString().trim()
	return /^[0-9_]+$/.test(id) && (id.length === 7 || id.length === 12)
	return false
}

module.exports = {isValidId}
