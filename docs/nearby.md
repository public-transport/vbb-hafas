# `nearby(latitude, longitude, [opt])`

`latitude` and `longitude` must be GPS coordinates like `52.5137344` and `13.4744798`.

With `opt`, you can override the default options, which look like this:

```js
{
	results:  8, // maximum number of results
	distance: null, // maximum walking distance in meters
	poi:      false, // return points of interest?
	stations: true, // return stations?
}
```

## Response

With `latitude = 52.5137344`, `longitude = 13.4744798` and `results: 2`, the response looks like this:

```js
[ {
	type: 'station',
	id: 9120001,
	name: 'S+U Frankfurter Allee (Berlin)',
	latitude: 13.475306,
	longitude: 52.513615,
	distance: 58
}, {
	type: 'station',
	id: 9120540,
	name: 'Scharnweberstr. (Berlin)',
	latitude: 13.470182,
	longitude: 52.512339,
	distance: 329
} ]
```
