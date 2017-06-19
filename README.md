# vbb-hafas

**A client for the Berlin & Brandenburg public transport service (VBB).** It acts as a consistent and straightforward promise-based interface on top of the verbose [HAFAS](http://hacon.de/hafas) API.

*Note*: Almost certainly, [vbb-client](https://github.com/derhuerst/vbb-client) is what you are looking for (it queries [vbb-rest](https://github.com/derhuerst/vbb-rest)). It is more feature-rich and lightweight.

[![npm version](https://img.shields.io/npm/v/vbb-hafas.svg)](https://www.npmjs.com/package/vbb-hafas)
[![build status](https://img.shields.io/travis/derhuerst/vbb-hafas.svg)](https://travis-ci.org/derhuerst/vbb-hafas)
[![dependency status](https://img.shields.io/david/derhuerst/vbb-hafas.svg)](https://david-dm.org/derhuerst/vbb-hafas)
[![dev dependency status](https://img.shields.io/david/dev/derhuerst/vbb-hafas.svg)](https://david-dm.org/derhuerst/vbb-hafas#info=devDependencies)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/vbb-hafas.svg)


## Installing

```shell
npm install vbb-hafas
```


## Getting Started

```javascript
const hafas = require('vbb-hafas')
```

- [`journeys(from, to, [opt])`](docs/journeys.md) to get journeys between locations
- [`journeyPartDetails(ref, name, [opt])`](docs/journey-part-details.md) to get details for a part of a journey
- [`departures(station, [opt])`](docs/departures.md) to query the next departures at a station
- [`nearby(latitude, longitude, [opt])`](docs/nearby.md) to show stations & POIs around
- [`locations(query, [opt])`](docs/locations.md) to find stations, POIs and addresses
- [`radar(query, [opt])`](docs/radar.md) to find all vehicles currently in a certain area

As an example, we will search for a journey [from *Berlin Hauptbahnhof* to *Berlin Charlottenburg*](https://www.google.de/maps/dir/Berlin+Hauptbahnhof,+Europaplatz,+Berlin/S+Berlin-Charlottenburg/@52.5212391,13.3287227,13z). To get the station ids, [use `vbb-stations`](https://github.com/derhuerst/vbb-stations#usage).

```javascript
client.journeys('900000003201', '900000024101', {results: 1})
.then((journeys) => console.log(journeys[0]))
```

The output will be in the [*Friendly Public Transport Format*](https://github.com/public-transport/friendly-public-transport-format):

```javascript
[
	{
		type: 'journey',
		// taken from the first part
		origin: {
			type: 'station',
			id: '900000003201',
			name: 'S+U Berlin Hauptbahnhof',
			coordinates: {latitude: 52.52585, longitude: 13.368928},
			products: // …
		},
		departure: '2017-05-16T13:31:00+02:00',
		// taken from the last part
		destination: {
			type: 'station',
			id: '900000024101',
			name: 'S Charlottenburg',
			coordinates: {latitude: 52.505049, longitude: 13.305213},
			products: // …
		},
		arrival: '2017-05-16T13:41:00+02:00',
		parts: [{
			origin: {
				type: 'station',
				id: '900000003201',
				name: 'S+U Berlin Hauptbahnhof',
				coordinates: {latitude: 52.52585, longitude: 13.368928},
				products: // …
			},
			departure: '2017-05-16T13:31:00+02:00',
			departurePlatform: '16',
			destination: {
				type: 'station',
				id: '900000024101',
				name: 'S Charlottenburg',
				coordinates: {latitude: 52.505049, longitude: 13.305213},
				products: // …
			},
			arrival: '2017-05-16T13:41:00+02:00',
			delay: 0,
			line: {
				type: 'line',
				id: 's75',
				name: 'S75',
				mode: 'train',
				product: 'suburban',
				class: 1,
				productCode: 0,
				productName: 'S-7',
				symbol: 'S',
				nr: 75,
				metro: false,
				express: false,
				night: false
			},
			arrivalPlatform: '8'
			direction: 'S Westkreuz',
		}]
	}
]
```


## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/vbb-hafas/issues).
