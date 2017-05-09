# `radar(north, west, south, east, [opt])`

`north`, `west`, `south` and `eath` must be numbers (e.g. `52.52411`). Together, they form a [bounding box](https://en.wikipedia.org/wiki/Minimum_bounding_box).

With `opt`, you can override the default options, which look like this:

```js
{
	results: 256, // maximum number of vehicles
	duration: 30, // compute frames for the next n seconds
	frames: 3, // nr of frames to compute
}
```

## Response

With `52.52411, 13.41002, 52.51942, 13.41709`, the response may look like this:

```js
[
	{
		direction: 'S Westkreuz',
		product: {
			line: 'S75',
			class: 1,
			symbol: 'S',
			nr: 75,
			metro: false,
			express: false,
			night: false,
			type: {
				category: 0,
				bitmask: 1,
				name: 'S-Bahn',
				short: 'S',
				type: 'suburban',
				color: '#008c4f',
				unicode: '🚈',
				ansi: ['green']
			}
		},
		coordinates: {
			latitude: 52.521508,
			longitude: 13.411267
		},
		nextStops: [
			{
				station: {
					type: 'station',
					id: 9151001,
					name: 'S Wartenberg',
					coordinates: {
						latitude: 52.573268,
						longitude: 13.504233
					}
				},
				departure: 2016-08-12T15:26:00.000Z, // Date object
				arrival: null
			}, {
				station: {
					type: 'station',
					id: 9100003,
					name: 'S+U Alexanderplatz',
					coordinates: {
						latitude: 52.521508,
						longitude: 13.411267
					}
				},
				departure: 2016-08-12T15:55:00.000Z, // Date object
				arrival: 2016-08-12T15:54:00.000Z // Date object
			},
			// …
			{
				station: {
					type: 'station',
					id: 9024102,
					name: 'S Westkreuz',
					coordinates: {
						latitude: 52.501147,
						longitude: 13.283036
					}
				},
				departure: null,
				arrival: 2016-08-12T16:14:00.000Z // Date object
			}
		],
		frames: [
			{origin: /* station */, destination: /* station */, t: 0},
			{origin: /* station */, destination: /* station */, t: 10000},
			{origin: /* station */, destination: /* station */, t: 20000},
			{origin: /* station */, destination: /* station */, t: 30000}
		],
	}, {
		direction: 'S+U Alexanderplatz',
		product: /* … */,
		coordinates: {
			latitude: 52.523045,
			longitude: 13.411725
		},
		nextStops: [/* … */],
		frames: [/* … */]
	}
]
```
