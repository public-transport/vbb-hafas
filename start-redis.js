#!/usr/bin/env node
'use strict'

const child = require('child_process')
const path  = require('path')
const fs    = require('fs')

const pidfile = path.join(__dirname, 'redis.pid')



try {
	const s = fs.statSync(pidfile)
	if (s && s.isFile()) {
		process.stdout.write('Redis seems to be running.\n')
		process.exit(1)
	}
} catch (e) {}

const db = child.spawn('redis-server',
	['--port', '6380', '--dir', __dirname], {detached: true})
fs.writeFileSync(pidfile, db.pid)

process.stdout.write('Redis listening on port 6380.\n')
