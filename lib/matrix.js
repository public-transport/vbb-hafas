'use strict'

const {deepStrictEqual: eql} = require('assert')
// todo: move to an npm package

const flatMap = (arr, fn) => {
	return arr.reduce((acc, v) => acc.concat(fn(v)), [])
}

const times = x => new Array(x).fill(x)
eql(flatMap([1, 2, 3], times), [1, 2, 2, 3, 3, 3])

const matrix2 = (l1, l2) => {
	return flatMap(l1, v1 => l2.map(v2 => [].concat(v1, v2)))
}

eql(matrix2([1,2], [3,4]), [
	[1,3], [1,4], [2,3], [2,4]
])

const matrix = (...lists) => {
	return lists
	.slice(1)
	.reduce((acc, l) => {
		return matrix2(acc, l)
	}, lists[0])
}

eql(matrix([1,2], [3,4], [5], [6,7]), [
	[1,3,5,6],
	[1,3,5,7],
	[1,4,5,6],
	[1,4,5,7],
	[2,3,5,6],
	[2,3,5,7],
	[2,4,5,6],
	[2,4,5,7]
])

module.exports = matrix
