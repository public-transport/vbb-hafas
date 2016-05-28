# vbb-hafas

**A client for the Berlin & Brandenburg public transport service (VBB).** It acts as a consistent and straightforward promise-based interface on top of the verbose [HAFAS](http://hacon.de/hafas) API.

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

- [`routes(from, to, [opt])`](docs/routes.md) to get routes between locations
- [`departures(station, [opt])`](docs/departures.md) to query the next departures at a station
- [`nearby(latitude, longitude, [opt])`](docs/nearby.md) to show stations & POIs around

As an example, we will search for a route [from *Berlin Hauptbahnhof* to *Berlin Charlottenburg*](https://www.google.de/maps/dir/Berlin+Hauptbahnhof,+Europaplatz,+Berlin/S+Berlin-Charlottenburg/@52.5212391,13.3287227,13z). To get the station ids, [use `vbb-stations`](https://github.com/derhuerst/vbb-stations#usage).

```javascript
client.routes(9003201, 9024101, {results: 1})
.then((routes) => console.log(routes[0]))
```

The output will have the following structure:

```javascript
{
  // taken from first part
  start: new Date('2016-05-28T01:08:00.000Z'),
  from: {
    type: 'station',
    id: 9003201,
    name: 'S+U Berlin Hauptbahnhof',
    latitude: 13.368928,
    longitude: 52.525849
  },

  // taken from last part
  end: new Date('2016-05-28T01:16:00.000Z'),
  to: {
    type: 'station',
    id: 9024101,
    name: 'S Charlottenburg Bhf (Berlin)',
    latitude: 13.305221,
    longitude: 52.505057
  },

  parts: [ {
    start: new Date('2016-05-28T01:08:00.000Z'),
    from: {
      type: 'station',
      id: 9003201,
      name: 'S+U Berlin Hauptbahnhof',
      latitude: 13.368928,
      longitude: 52.525849
    },
    end: new Date('2016-05-28T01:16:00.000Z'),
    to: {
      type: 'station',
      id: 9024101,
      name: 'S Charlottenburg Bhf (Berlin)',
      latitude: 13.305221,
      longitude: 52.505057
    },
    direction: 'Nauen, Bahnhof',
    product: {
      line: 'RB14',
      symbol: 'RB',
      nr: 14,
      metro: false,
      express: false,
      night: false,
      type: {
        category: 6,
        bitmask: 64,
        name: 'RB/RE',
        short: 'R',
        type: 'regional',
        color: '#ff0000',
        unicode: '🚆',
        ansi: ['red']
      }
    }
  } ]
}
```


## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/vbb-hafas/issues).
