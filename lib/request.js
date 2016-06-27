'use strict'

const parse = require('./parse')
const hafas = require('hafas-client')

const endpoint = 'http://fahrinfo.vbb.de/bin/mgate.exe'
const client = {type: 'IPA', id: 'BVG'}
const ext = 'VBB.2'
const version = '1.11'
const auth = {type: 'AID', aid: 'hafas-vbb-apps'}
const onBody = (body) => Object.assign(body, {client, ext, ver: version, auth})

const onProduct = parse.product

const request = hafas({endpoint, onBody, onProduct})
module.exports = request
