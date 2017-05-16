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
[{
	direction: 'S Ostbahnhof',
	line: {
		type: 'line',
		id: '248',
		name: '248',
		mode: 'bus',
		product: 'bus',
		class: 8,
		symbol: null,
		nr: 248,
		metro: false,
		express: false,
		night: false
	},
	coordinates: {latitude: 52.52007, longitude: 13.414468},
	nextStops: [
		{
			station: {
				type: 'station',
				id: '900000058109',
				name: 'Reichartstr.',
				coordinates: {latitude: 52.472607, longitude: 13.367121}
			},
			departure: '2017-05-16T16:33:00+02:00',
			arrival: null
		}
		// …
	],
	frames: [
		{
			origin: {
				type: 'station',
				id: '900000100560',
				name: 'Littenstr.',
				coordinates: {latitude: 52.51936, longitude: 13.413065}
			},
			destination: {
				type: 'station',
				id: '900000100712',
				name: 'S+U Alexanderpl./Grunerstr.(Bln) [Alexanderstr.]',
				coordinates: {latitude: 52.520322, longitude: 13.415708}
			},
			t: 0
		}
		// …
	]
}, {
	direction: 'S Wartenberg',
	line: {
		type: 'line',
		id: 's75',
		name: 'S75',
		mode: 'train',
		product: 'suburban',
		class: 1,
		symbol: 'S',
		nr: 75,
		metro: false,
		express: false,
		night: false
	},
	coordinates: {latitude: 52.521508, longitude: 13.411267},
	nextStops: [
		{
			station: {
				type: 'station',
				id: '900000024102',
				name: 'S Westkreuz',
				coordinates: {latitude: 52.501148, longitude: 13.283036}
			},
			departure: '2017-05-16T16:50:00+02:00',
			arrival: null
		}
		// …
	],
	frames: [
		{
			origin: {
				type: 'station',
				id: '900000100003',
				name: 'S+U Alexanderplatz',
				coordinates: {latitude: 52.521508, longitude: 13.411267}
			},
			destination: {
				type: 'station',
				id: '900000100004',
				name: 'S+U Jannowitzbrücke',
				coordinates: {latitude: 52.515503, longitude: 13.418027}
			},
			t: 0
		}
		// …
	]
}]
```
