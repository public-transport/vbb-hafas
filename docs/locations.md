# [`locations(query[, options])`](../src/Client.js#L62)

**Finds stations, addresses and [POI](https://en.wikipedia.org/wiki/Point_of_interest)s** matching `query`.

`locations` returns a promise that will resolve with an `Array` of results.



## Example

```javascript
client.locations('Westend', {
	results: 2,
	pois: false
}).then(function (results) {
	console.log(results);
});
```


## Output

```javascript
[
  {
    name: 'U Neu-Westend (Berlin)',
    latitude: 52.516411,
    longitude: 13.259907,
    id: 9026101,
    type: 'station',
    products: {
      suburban: false,
      subway: true,
      tram: false,
      bus: true,
      ferry: false,
      express: false,
      regional: false
    }
  }, {
    name: 'Westend (Berlin) (S)',
    latitude: 52.518613,
    longitude: 13.28424,
    id: 9026207,
    type: 'station',
    products: {
      suburban: true,
      subway: false,
      tram: false,
      bus: true,
      ferry: false,
      express: false,
      regional: false
    }
  }
]
```



## `query`

Type: `String`; *Required*

Can be any query.



## `options`

Type: `Options`;

My contain any of the following options.

| options | default | type | description |
|:----------|:----|:-----|:------------|
| `apiKey` | `client.apiKey` | `String` | The [API key](http://www.vbb.de/de/article/webservices/schnittstellen-fuer-webentwickler/5070.html#testserver) to be used. |
| `results` | `5` | `Integer` | The number of results, limited to `1000` by HAFAS. |
| `stations` | `true` | `Boolean` | If stations should be included in the search results. |
| `addresses` | `true` | `Boolean` | If addresses should be included in the search results. |
| `pois` | `true` | `Boolean` | If [POI](https://en.wikipedia.org/wiki/Point_of_interest)s should be included in the search results. |
