'use strict'

const parse = require('./parse')
const hafas = require('hafas-client')

const endpoint = 'https://bvg-apps.hafas.de/bin/mgate.exe'
const client = {type: 'IPA', id: 'BVG', name: 'FahrInfo', v: '4070700'}
const ext = 'BVG.1'
const version = '1.15' // todo: 1.16 with `mic` and `mac` query params
const auth = {type: 'AID', aid: '1Rxs112shyHLatUX4fofnmdxK'}
const onBody = (body) => {
	return Object.assign(body, {client, ext, ver: version, auth})
}

const onLine = parse.line
const onLocation = parse.location

const request = hafas({endpoint, onBody, onLine, onLocation})
module.exports = request
