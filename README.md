# vbb

*vbb* is a JavaScript **API for the Berlin & Brandenburg public transport service** (VBB). It puts a consistent and straightforward [promise](https://github.com/petkaantonov/bluebird#what-are-promises-and-why-should-i-use-them)-based interface on top of the verbose [HAFAS](http://hacon.de/hafas) REST API. *vbb* is **[MIT-licensed](LICENSE)** and embraces [prototypal programming](http://davidwalsh.name/javascript-objects-deconstruction#simpler-object-object).

[![dependency status](https://img.shields.io/david/derhuerst/vbb.svg)](https://david-dm.org/derhuerst)



## Installing

```shell
npm install vbb
```



## Getting Started

We `require` the *vbb* factory function and pass the [API key](http://www.vbb.de/de/article/webservices/schnittstellen-fuer-webentwickler/5070.html#testserver).

```javascript
var vbb = require('vbb');
var client = vbb('<your API key>');
```

We have access to three methods now:

- [`locations`](docs/locations.md) to find stations, addresses and [POI](https://en.wikipedia.org/wiki/Point_of_interest)s
- [`routes`](docs/routes.md) to get routes between locations
- [`departures`](docs/departures.md) to query the next departures at a station

As an example, we will search for a route [from *Berlin Hauptbahnhof* to *Berlin Charlottenburg*](https://www.google.de/maps/dir/Berlin+Hauptbahnhof,+Europaplatz,+Berlin/S+Berlin-Charlottenburg/@52.5212391,13.3287227,13z).

First, we have to look up the `id`s of those two stations:

```javascript
var Promise = require('bluebird');

Promise.join(
	client.locations('Berlin Hauptbahnhof'),   // start query promise
	client.locations('Berlin Charlottenburg'),   // dest. query promise
	function (startResults, destResults) {   // the results of both promises
		var startId = startResults[0].id;
		var destId = destResults[0].id;

	return client.routes({
		from: startId,
		to: destId
	});
})
.then(function (routes) {
	console.log(routes[0]);
});
```

The output will have the following structure:

```javascript
{
  duration: 600000,   // milliseconds
  parts: [   // all "sections" of the route
    {
      from: {
        title: 'S+U Berlin Hauptbahnhof',
        latitude: 52.525849,
        longitude: 13.368928,
        id: 9003201,
        type: 'station',
        notes: {
          lift: true,
          tactilePaving: true,
          escalator: true
        },
        when: Sat Aug 01 2015 15:48:00 GMT+0200 (CEST)   // `Date` object
      },
      to: {
        title: 'S Charlottenburg Bhf (Berlin)',
        latitude: 52.505048,
        longitude: 13.305212,
        id: 9024101,
        type: 'station',
        notes: {},
        when: Sat Aug 01 2015 15:58:00 GMT+0200 (CEST)   // `Date` object
      },
      transport: 'public',   // another value: `'walk'`
      type: 'suburban',   // another value: `'subway'`
      direction: 'S Spandau Bhf (Berlin)',
      notes: {}
    }
  ]
}
```



## Documentation

coming soon.



## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/vbb/issues).
