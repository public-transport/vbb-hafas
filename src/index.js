'use strict'

const Client = require('./Client')

const factory = function (apiKey, endpoint) {
	const instance = Object.create(Client)
	instance.init(apiKey, endpoint)
	return instance
};

module.exports = Object.assign(factory, {Client})
