# vbb-hafas

**A client for the Berlin & Brandenburg public transport service (VBB).** It acts as a consistent and straightforward interface on top of a verbose API.

This project is actually a thin wrapper around [`hafas-client`](https://github.com/derhuerst/hafas-client#hafas-client). [Its docs](https://github.com/derhuerst/hafas-client/tree/master/docs) document the API in general.

*Note*: You may not want to query the VBB API by yourself. [`vbb-client`](https://github.com/derhuerst/vbb-client) is an API-compatible client for [`vbb-rest`](https://github.com/derhuerst/vbb-rest), my wrapper API. It also works in the browser.

![vbb-rest architecture diagram](https://rawgit.com/derhuerst/vbb-rest/hafas-rest-api/architecture.svg)

[![npm version](https://img.shields.io/npm/v/vbb-hafas.svg)](https://www.npmjs.com/package/vbb-hafas)
[![dependency status](https://img.shields.io/david/derhuerst/vbb-hafas.svg)](https://david-dm.org/derhuerst/vbb-hafas)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/vbb-hafas.svg)
[![chat on gitter](https://badges.gitter.im/derhuerst.svg)](https://gitter.im/derhuerst)


## Installing

```shell
npm install vbb-hafas
```


## Getting Started

```javascript
const hafas = require('vbb-hafas')
```

As an example, we will search for a journey [from *Berlin Hauptbahnhof* to *Berlin Charlottenburg*](https://www.google.de/maps/dir/Berlin+Hauptbahnhof,+Europaplatz,+Berlin/S+Berlin-Charlottenburg/@52.5212391,13.3287227,13z). To get the station ids, [use `vbb-stations`](https://github.com/derhuerst/vbb-stations#usage).

```javascript
client.journeys('900000003201', '900000024101', {results: 1})
.then((journeys) => console.log(journeys[0]))
.catch(console.error)
```

The output will be a [`journey` object in the *Friendly Public Transport Format* `1.0.1` format](https://github.com/public-transport/friendly-public-transport-format/tree/1.0.1/spec#journey):

```javascript
[ {
	legs: [ {
		id: '1|50420|0|86|25122017',
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
		departurePlatform: '14',
		delay: 0,
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
		arrivalPlatform: '4',
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
		direction: 'Brandenburg, Hbf'
	} ],
	// all these are from the first leg
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
	arrival: '2017-12-26T00:50:00.000+01:00'
} ]
```

## API

Check [the docs for `hafas-client`](https://github.com/derhuerst/hafas-client/tree/any-endpoint/docs) as well as [the VBB-specific customisations](https://github.com/derhuerst/hafas-client/blob/master/p/vbb/readme.md).


## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/vbb-hafas/issues).
