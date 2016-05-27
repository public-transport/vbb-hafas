'use strict'

const date = (when) => ''
	+ when.getFullYear()
	+ ('0' + (1 + when.getMonth())).slice(-2)
	+ ('0' + when.getDate()).slice(-2)

const time = (when) => ''
	+ ('0' + when.getHours()).slice(-2)
	+ ('0' + when.getMinutes()).slice(-2)
	+ ('0' + when.getSeconds()).slice(-2)



module.exports = {date, time}
