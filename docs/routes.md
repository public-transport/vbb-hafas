# `routes(from, to, [opt])`

`from` and `to` must be station ids like `9013102`.

With `opt`, you can override the default options, which look like this:

```js
{
	when:           new Date(),
	results:        5, // how many routes?
	via:            null, // let routes pass this station
	passedStations: false, // return stations on the way?
	transfers:      5, // maximum of 5 transfers
	transferTime:   0, // minimum time for a single transfer in minutes
	accessibility:  'none', // 'none', 'partial' or 'complete'
	bike:           false, // only bike-friendly routes
	products: {
		suburban:   true,
		subway:     true,
		tram:       true,
		bus:        true,
		ferry:      true,
		express:    true,
		regional:   true
	}
}
```

## Response

With `passedStations: true` and `results: 1`, the response looks like this:

```js
[ {
	parts: [ {
		direction: 'U Uhlandstr. (Berlin)',
		start: 2016-06-26T16:17:00.000Z, // Date object
		from: {
			type: 'station',
			id: 9013102,
			name: 'U Kottbusser Tor (Berlin)',
			latitude: 13.417748,
			longitude: 52.499053
		},
		end: 2016-06-26T16:21:00.000Z, // Date object
		to: {
			type: 'station',
			id: 9012103,
			name: 'U Hallesches Tor (Berlin)',
			latitude: 13.391769,
			longitude: 52.497776
		},
		product: {
			line: 'U1',
			symbol: 'U',
			nr: 1,
			metro: false,
			express: false,
			night: false,
			type: {
				category: 1,
				bitmask: 2,
				name: 'U-Bahn',
				short: 'U',
				type: 'subway',
				color: '#0067ac',
				unicode: '🚇',
				ansi: ['blue']
			}
		},
		// from `passedStations: true`
		stops: [
			{
				station: {
					type: 'station',
					id: 9013102,
					name: 'U Kottbusser Tor (Berlin)',
					latitude: 13.417748,
					longitude: 52.499053
				},
				arrival: 2016-06-26T16:17:00.000Z, // Date object
				departure: 2016-06-26T16:17:00.000Z // Date object
			}, {
				station: {
					type: 'station',
					id: 9013103,
					name: 'U Prinzenstr. (Berlin)',
					latitude: 13.406539,
					longitude: 52.49828
				},
				arrival: 2016-06-26T16:19:00.000Z, // Date object
				departure: 2016-06-26T16:19:00.000Z // Date object
			}, {
				station: {
					type: 'station',
					id: 9012103,
					name: 'U Hallesches Tor (Berlin)',
					latitude: 13.391769,
					longitude: 52.497776
				},
				arrival: 2016-06-26T16:21:00.000Z, // Date object
				departure: 2016-06-26T16:21:00.000Z // Date object
			}
		]
	} ],
	// taken from parts[0]
	start: 2016-06-26T16:17:00.000Z, // shorthand for parts[0].start
	from: { // shorthand for parts[0].from
		type: 'station',
		id: 9013102,
		name: 'U Kottbusser Tor (Berlin)',
		latitude: 13.417748,
		longitude: 52.499053
	},
	// taken from parts[parts.length - 1]
	end: 2016-06-26T16:21:00.000Z, // shorthand for parts[parts.length - 1].end
	to: {
		type: 'station',
		id: 9012103,
		name: 'U Hallesches Tor (Berlin)',
		latitude: 13.391769,
		longitude: 52.497776
	}
} ]
```
