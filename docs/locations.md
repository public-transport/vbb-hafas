# [`locations(query[, options])`](../src/Client.js#L64)

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
    title: 'U Neu-Westend (Berlin)',
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
    title: 'Westend (Berlin) (S)',
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
| `results` | `5` | `Integer` | The number of results, limited to `1000` by HAFAS. |
| `stations` | `true` | `Boolean` | If stations should be included in the search results. |
| `addresses` | `true` | `Boolean` | If addresses should be included in the search results. |
| `pois` | `true` | `Boolean` | If [POI](https://en.wikipedia.org/wiki/Point_of_interest)s should be included in the search results. |
| `products` | – | `Object` | My contain any of the following transport products. |

| product | default | description |
|:----------|:----|:-----|:------------|
| `products.suburban` | `true` | If [S-Bahn trains](https://en.wikipedia.org/wiki/Berlin_S-Bahn) should be included in the search results. |
| `products.subway` | `true` | If [U-Bahn trains](https://en.wikipedia.org/wiki/Berlin_U-Bahn) should be included in the search results. |
| `products.tram` | `true` | If [tramway vehicles](https://en.wikipedia.org/wiki/Trams_in_Berlin) should be included in the search results. |
| `products.bus` | `true` | If [buses](https://en.wikipedia.org/wiki/Bus_transport_in_Berlin) should be included in the search results. |
| `products.ferry` | `true` | If [ferries](https://en.wikipedia.org/wiki/Ferry_transport_in_Berlin) should be included in the search results. |
| `products.express` | `false` | If [IC](https://en.wikipedia.org/wiki/Intercity_%28Deutsche_Bahn%29)/[EC](https://en.wikipedia.org/wiki/EuroCity)/[ICE](https://en.wikipedia.org/wiki/Intercity-Express) should be included in the search results. |
| `products.regional` | `true` | If [RE](https://en.wikipedia.org/wiki/Regional-Express)/[RB](https://en.wikipedia.org/wiki/Regionalbahn)/[IRE](https://en.wikipedia.org/wiki/Interregio-Express) trains should be included in the search results. |
