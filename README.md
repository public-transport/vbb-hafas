# vbb-hafas

*vbb-hafas* is a JavaScript **API for the Berlin & Brandenburg public transport service** (VBB). It puts a consistent and straightforward promise-based interface on top of the verbose [HAFAS](http://hacon.de/hafas) REST API.

[![npm version](https://img.shields.io/npm/v/vbb-hafas.svg)](https://www.npmjs.com/package/vbb-hafas)
[![dependency status](https://img.shields.io/david/derhuerst/vbb-hafas.svg)](https://david-dm.org/derhuerst/vbb-hafas)

*vbb-hafas* is **[ISC-licensed](license.md)**.


## Installing

```shell
npm install vbb-hafas
```


## Getting Started

```javascript
const hafas = require('vbb-hafas')
```

- `routes(key, from, to, [opt])` to get routes between locations
- `departures(key, station, [opt])` to query the next departures at a station

As an example, we will search for a route [from *Berlin Hauptbahnhof* to *Berlin Charlottenburg*](https://www.google.de/maps/dir/Berlin+Hauptbahnhof,+Europaplatz,+Berlin/S+Berlin-Charlottenburg/@52.5212391,13.3287227,13z). To get the station ids, [use `vbb-static`](https://github.com/derhuerst/vbb-static#usage).

```javascript
client.routes('<your API key>', startId, destId)
.then((routes) => console.log(routes[0]))
```

The output will have the following structure:

```javascript
{
  duration: 600000,      // milliseconds
  parts: [               // all "sections" of the route
    {
      from: {
        title:           'S+U Berlin Hauptbahnhof',
        latitude:        52.525849,
        longitude:       13.368928,
        id:              9003201,
        type:            'station',
        notes: {
          lift:          true,
          tactilePaving: true,
          escalator:     true
        },
        when:            Sat Aug 01 2015 15:48:00 GMT+0200 (CEST)   // `Date` object
      },
      to: {
        title:           'S Charlottenburg Bhf (Berlin)',
        latitude:        52.505048,
        longitude:       13.305212,
        id:              9024101,
        type:            'station',
        notes: {},
        when:            Sat Aug 01 2015 15:58:00 GMT+0200 (CEST)   // `Date` object
      },
      transport:         'public',   // another value: `'walk'`
      type:              'suburban',   // another value: `'subway'`
      direction:         'S Spandau Bhf (Berlin)',
      notes: {}
    }
  ]
}
```


## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/vbb-hafas/issues).
