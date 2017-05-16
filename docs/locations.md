# `locations(query, [opt])`

`query` must be an string (e.g. `'Alexanderplatz'`).

With `opt`, you can override the default options, which look like this:

```js
{
	  fuzzy:     true // find only exact matches?
	, results:   10 // how many search results?
	, stations:  true
	, addresses: true
	, poi:       true // points of interest
}
```

## Response

With `query = 'Alexanderplatz'` and `results: 2`, the response looks like this:

```js
[{
	type: 'station',
	id: '900000100003',
	name: 'S+U Alexanderplatz',
	coordinates: {latitude: 52.521508, longitude: 13.411267},
	products: {
		suburban: true,
		subway: true,
		tram: true,
		bus: true,
		ferry: false,
		express: false,
		regional: true
	}
}, {
	type: 'poi',
	id: '9980709',
	name: 'Berlin, Holiday Inn Centre Alexanderplatz****',
	coordinates: {latitude: 52.523549, longitude: 13.418441}
}]
```
