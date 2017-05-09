# `departures(station, [opt])`

`station` must be a station id like `900000013102`.

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
[
	{
		station: {
			type: 'station',
			id: '900000013172',
			name: 'U Kottbusser Tor [Bus Adalbertstr.]',
			coordinates: {
				latitude: 13.391769,
				longitude: 52.497776
			}
		},
		when: '2016-06-27T15:39:00.000Z',
		direction: 'U Hermannplatz',
		product: {
			line: 'N8',
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
			symbol: 'N',
			nr: 8,
			metro: false,
			express: false,
			night: true
		}
	}
	// …
]
```
