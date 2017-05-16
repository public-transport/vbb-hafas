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
[{
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
	when: '2017-05-16T14:41:00+02:00',
	direction: 'S+U Warschauer Str.',
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
	trip: 27085,
	delay: 60000 // in milliseconds
}, {
	station: {
		type: 'station',
		id: '900000013172',
		name: 'U Kottbusser Tor [Bus Adalbertstr.]',
		coordinates: {latitude: 52.499898, longitude: 13.418378},
		products: {
			suburban: false,
			subway: false,
			tram: false,
			bus: true,
			ferry: false,
			express: false,
			regional: false
		}
	},
	when: '2017-05-16T14:53:00+02:00',
	direction: 'U Mehringdamm',
	line: {
		type: 'line',
		id: '140',
		name: '140',
		mode: 'bus',
		product: 'bus',
		class: 8,
		productCode: 3,
		productName: 'B',
		symbol: null,
		nr: 140,
		metro: false,
		express: false,
		night: false
	},
	trip: 6363,
	delay: 2160000 // in milliseconds
}]
```
