'use strict'

const moment = require('moment-timezone')

const date = (when) =>
	moment(when).tz('Europe/Berlin').format('YYYYMMDD')
const time = (when) =>
	moment(when).tz('Europe/Berlin').format('HHmmss')

module.exports = {date, time}
