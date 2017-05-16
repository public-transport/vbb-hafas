# `nearby(latitude, longitude, [opt])`

`latitude` and `longitude` must be GPS coordinates like `52.5137344` and `13.4744798`.

With `opt`, you can override the default options, which look like this:

```js
{
	distance: null, // maximum walking distance in meters
	poi:      false, // return points of interest?
	stations: true, // return stations?
}
```

## Response

With `latitude = 52.5137344`, `longitude = 13.4744798`, the response looks like this:

```js
[
	{
		type: 'station',
		id: '900000120001',
		name: 'S+U Frankfurter Allee',
		coordinates: {latitude: 52.513616, longitude: 13.475298},
		products: {
			suburban: true,
			subway: true,
			tram: true,
			bus: true,
			ferry: false,
			express: false,
			regional: false
		},
		distance: 56
	}, {
		type: 'station',
		id: '900000120540',
		name: 'Scharnweberstr./Weichselstr.',
		coordinates: {latitude: 52.512339, longitude: 13.470174},
		products: {
			suburban: false,
			subway: false,
			tram: true,
			bus: false,
			ferry: false,
			express: false,
			regional: false
		},
		distance: 330
	}
	// …
]
```
