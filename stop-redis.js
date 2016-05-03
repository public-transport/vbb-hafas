#!/usr/bin/env node
'use strict'

const child = require('child_process')
const path  = require('path')
const fs    = require('fs')

const pidfile = path.join(__dirname, 'redis.pid')



try {
	const s = fs.statSync(pidfile)
	if (!s || !s.isFile()) throw new Error('redis.pid is not a file.')
} catch (err) {
	process.stdout.write(err.message)
	process.exit(1)
}

const pid = fs.readFileSync(pidfile)
const db = child.execSync('kill ' + pid,
	{stdio: ['ignore', 'ignore', process.stderr]})
fs.unlinkSync(pidfile)

process.stdout.write('Redis stopped.\n')
