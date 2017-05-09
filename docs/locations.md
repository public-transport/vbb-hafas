# `locations(query, [opt])`

`query` must be an string (e.g. `Alexanderplatz`).

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

With `query = 'Alexanderplatz'`, the response looks like this:

```js
[
	{
		type: 'station',
		id: '900000100003',
		name: 'S+U Alexanderplatz',
		coordinates: {
			latitude: 52.521508,
			longitude: 13.411267,
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
	}, {
		type: 'poi',
		id: '9980709',
		name: 'Berlin, Holiday Inn Centre Alexanderplatz****',
		coordinates: {
			latitude: 52.524555,
			longitude: 13.420265
		}
	}, {
		type: 'address',
		name: '03238 Finsterwalde, Alexanderplatz'
		coordinates: {
			latitude: 51.631342,
			longitude: 13.707569
		}
	}
	// …
]
```
