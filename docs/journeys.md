# `journeys(from, to, [opt])`

`from` and `to` must be station ids like `'900000013102'`.

With `opt`, you can override the default options, which look like this:

```js
{
	when:           new Date(),
	results:        5, // how many journeys?
	via:            null, // let journeys pass this station
	passedStations: false, // return stations on the way?
	transfers:      5, // maximum of 5 transfers
	transferTime:   0, // minimum time for a single transfer in minutes
	accessibility:  'none', // 'none', 'partial' or 'complete'
	bike:           false, // only bike-friendly journeys
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

*Note*: The `departure` and `arrival` fields contain realtime information if available. The `delay` field expresses how much they differ from the schedule.

With `passedStations: true` and `results: 1`, the response looks like this:

```js
[
	{
		type: 'journey',
		parts: [{
			id: '1|24983|22|86|18062017',
			origin: {
				type: 'station',
				id: '900000013102',
				name: 'U Kottbusser Tor',
				coordinates: {latitude: 52.499044, longitude: 13.417749},
				products: {
					suburban: false,
					subway: true,
					tram: false,
					bus: true,
					ferry: false,
					express: false,
					regional: false
				}
			},
			departure: '2017-05-16T13:22:00+02:00',
			destination: {
				type: 'station',
				id: '900000012103',
				name: 'U Hallesches Tor',
				coordinates: {latitude: 52.497777, longitude: 13.391761},
				products: {
					suburban: false,
					subway: true,
					tram: false,
					bus: true,
					ferry: false,
					express: false,
					regional: false
				}
			},
			arrival: '2017-05-16T13:26:00+02:00',
			delay: 0,
			line: {
				type: 'line',
				id: 'u1',
				name: 'U1',
				mode: 'train',
				product: 'subway',
				class: 2,
				productCode: 1,
				productName: 'U',
				symbol: 'U',
				nr: 1,
				metro: false,
				express: false,
				night: false
			},
			direction: 'U Uhlandstr.',
			passed: [{
				station: {
					type: 'station',
					id: '900000013102',
					name: 'U Kottbusser Tor',
					coordinates: {latitude: 52.499044, longitude: 13.417749},
					products: {
						suburban: false,
						subway: true,
						tram: false,
						bus: true,
						ferry: false,
						express: false,
						regional: false
					}
				},
				arrival: '2017-05-16T13:22:00+02:00',
				departure: '2017-05-16T13:22:00+02:00'
			}, {
				station: {
					type: 'station',
					id: '900000013103',
					name: 'U Prinzenstr.',
					coordinates: {latitude: 52.498271, longitude: 13.40653},
					products: {
						suburban: false,
						subway: true,
						tram: false,
						bus: true,
						ferry: false,
						express: false,
						regional: false
					}
				},
				arrival: '2017-05-16T13:24:00+02:00',
				departure: '2017-05-16T13:24:00+02:00'
			}, {
				station: {
					type: 'station',
					id: '900000012103',
					name: 'U Hallesches Tor',
					coordinates: {latitude: 52.497777, longitude: 13.391761},
					products: {
						suburban: false,
						subway: true,
						tram: false,
						bus: true,
						ferry: false,
						express: false,
						regional: false
					}
				},
				arrival: '2017-05-16T13:26:00+02:00',
				departure: '2017-05-16T13:26:00+02:00'
			}]
		}],
		// taken from the first part
		origin: {
			type: 'station',
			id: '900000013102',
			name: 'U Kottbusser Tor',
			coordinates: {latitude: 52.499044, longitude: 13.417749},
			products: {
				suburban: false,
				subway: true,
				tram: false,
				bus: true,
				ferry: false,
				express: false,
				regional: false
			}
		},
		departure: '2017-05-16T13:22:00+02:00',
		// taken from the last part
		destination: {
			type: 'station',
			id: '900000012103',
			name: 'U Hallesches Tor',
			coordinates: {latitude: 52.497777, longitude: 13.391761},
			products: {
				suburban: false,
				subway: true,
				tram: false,
				bus: true,
				ferry: false,
				express: false,
				regional: false
			}
		},
		arrival: '2017-05-16T13:26:00+02:00'
	}
]
```
