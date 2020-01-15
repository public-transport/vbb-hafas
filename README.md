# vbb-hafas

**A client for the Berlin & Brandenburg public transport service (VBB).** It acts as a consistent and straightforward interface on top of a verbose API.

This project is actually a thin wrapper around [`hafas-client@5`](https://github.com/public-transport/hafas-client/tree/5#hafas-client). [Its docs](https://github.com/public-transport/hafas-client/tree/5/docs) document the API in general.

*Note*: You may not want to query the VBB API by yourself. [`vbb-client`](https://github.com/derhuerst/vbb-client) is an API-compatible client for [`vbb-rest`](https://github.com/derhuerst/vbb-rest), my wrapper API. It also works in the browser.

![vbb-rest architecture diagram](https://rawgit.com/derhuerst/vbb-rest/hafas-rest-api/architecture.svg)

[![npm version](https://img.shields.io/npm/v/vbb-hafas.svg)](https://www.npmjs.com/package/vbb-hafas)
[![build status](https://api.travis-ci.org/derhuerst/vbb-hafas.svg?branch=master)](https://travis-ci.org/derhuerst/vbb-hafas)
[![dependency status](https://img.shields.io/david/derhuerst/vbb-hafas.svg)](https://david-dm.org/derhuerst/vbb-hafas)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/vbb-hafas.svg)
[![chat on gitter](https://badges.gitter.im/derhuerst.svg)](https://gitter.im/derhuerst)
[![support me on Patreon](https://img.shields.io/badge/support%20me-on%20patreon-fa7664.svg)](https://patreon.com/derhuerst)


## Installing

```shell
npm install vbb-hafas
```


## API

Check [the docs for `hafas-client`](https://github.com/public-transport/hafas-client/tree/5/docs) as well as [its VBB-specific customisations](https://github.com/public-transport/hafas-client/blob/4/p/vbb/readme.md).


## Usage

```javascript
const createHafas = require('vbb-hafas')

const hafas = createHafas('my-awesome-program')
```

As an example, we will search for a journey [from *Berlin Hauptbahnhof* to *Berlin Charlottenburg*](https://www.google.de/maps/dir/Berlin+Hauptbahnhof,+Europaplatz,+Berlin/S+Berlin-Charlottenburg/@52.5212391,13.3287227,13z). To get the station IDs, [use `vbb-stations`](https://github.com/derhuerst/vbb-stations#usage).

```javascript
hafas.journeys('900000003201', '900000024101', {results: 1})
.then((journeys) => console.log(journeys[0]))
.catch(console.error)
```

The output will be an array of [`journey` objects in the *Friendly Public Transport Format* `1.2.1` format](https://github.com/public-transport/friendly-public-transport-format/tree/1.2.1/spec#journey):

```javascript
[ {
	legs: [ {
		tripId: '1|50420|0|86|25122017',
		direction: 'Brandenburg, Hbf',
		line: {
			type: 'line',
			id: '10',
			name: 'RE1',
			public: true,
			mode: 'train',
			product: 'regional',
			symbol: 'RE',
			nr: 1,
			metro: false,
			express: true,
			night: false,
			class: 64,
			productCode: 6,
			operator: {
				type: 'operator',
				id: 'db-regio-ag',
				name: 'DB Regio AG'
			}
		},

		origin: {
			type: 'station',
			id: '900000003201',
			name: 'S+U Berlin Hauptbahnhof',
			location: {
				type: 'location',
				latitude: 52.52585,
				longitude: 13.368928
			},
			products: {
				suburban: true,
				subway: true,
				tram: true,
				bus: true,
				ferry: false,
				express: true,
				regional: true
			}
		},
		departure: '2017-12-26T00:41:00.000+01:00',
		plannedDeparture: '2017-12-26T00:41:00.000+01:00',
		departureDelay: 0,
		departurePlatform: '14',
		plannedDeparturePlatform: '13',

		destination: {
			type: 'station',
			id: '900000024101',
			name: 'S Charlottenburg',
			location: {
				type: 'location',
				latitude: 52.504806,
				longitude: 13.303846
			},
			products: {
				suburban: true,
				subway: false,
				tram: false,
				bus: true,
				ferry: false,
				express: false,
				regional: true
			}
		},
		arrival: '2017-12-26T00:50:00.000+01:00',
		plannedArrival: '2017-12-26T00:50:00.000+01:00',
		arrivalDelay: null,
		arrivalPlatform: '4',
		plannedArrivalPlatform: '4'
	} ],

	// all these are from the first leg
	origin: {
		type: 'station',
		id: '900000003201',
		name: 'S+U Berlin Hauptbahnhof'
		// …
	},
	departure: '2017-12-26T00:41:00.000+01:00',
	plannedDeparture: '2017-12-26T00:41:00.000+01:00',
	departureDelay: 0,
	departurePlatform: '14',
	plannedDeparturePlatform: '13',

	// all these are from the last leg
	destination: {
		type: 'station',
		id: '900000024101',
		name: 'S Charlottenburg'
		// …
	},
	arrival: '2017-12-26T00:50:00.000+01:00',
	plannedArrival: '2017-12-26T00:50:00.000+01:00',
	arrivalDelay: null,
	arrivalPlatform: '4',
	plannedArrivalPlatform: '4'

	// …
} ]
```


### Transfer information for journeys

`vbb-hafas` will try to add transfer information from [`vbb-change-positions`](https://github.com/juliuste/vbb-change-positions) if you pass `transferInfo: true` as an option.

If it identifies a known transfer, the previous leg will have a `bestArrivalPosition` and the next leg will have a `departurePosition`, indicating the optimal transfer between both platforms. Check out the markup in [`vbb-change-positions`](https://github.com/juliuste/vbb-change-positions) for more details.


## Related

Check [`hafas-client`'s related libs](https://github.com/public-transport/hafas-client/blob/4/readme.md#related).


## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/vbb-hafas/issues).
