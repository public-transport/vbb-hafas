# `departures(station, [opt])`

`station` must be a station id like `9013102`.

With `opt`, you can override the default options, which look like this:

```js
{
	when:      new Date(),
	direction: null, // only show departures heading to this station
	duration:  10 // show departures for the next n minutes
}
```

## Response

With `duration: 1`, the response may look like this:

```js
[ {
	station: {
		type: 'station',
		id: 9012103,
		name: 'U Hallesches Tor',
		latitude: 13.391769,
		longitude: 52.497776
	},
	when: 2016-06-27T15:39:00.000Z, // Date object
	direction: 'Sonnenallee/Baumschulenstr.',
	product: {
		line: 'M41',
		type: {
			category: 3,
			bitmask: 8,
			name: 'Bus',
			short: 'B',
			type: 'bus',
			color: '#a5037b',
			unicode: '🚌',
			ansi: ['dim', 'magenta']
		},
		symbol: 'M',
		nr: 41,
		metro: true,
		express: false,
		night: false
	}
}, {
	station: {
		type: 'station',
		id: 9012103,
		name: 'U Hallesches Tor',
		latitude: 13.391769,
		longitude: 52.497776
	},
	when: 2016-06-27T17:14:00.000Z, // Date object
	direction: 'U Alt-Tegel',
	product: {
		line: 'U6',
		type: {
			category: 1,
			bitmask: 2,
			name: 'U-Bahn',
			short: 'U',
			type: 'subway',
			color: '#0067ac',
			unicode: '🚇',
			ansi: ['blue']
		},
		symbol: 'U',
		nr: 6,
		metro: false,
		express: false,
		night: false
	}
} ]
```
