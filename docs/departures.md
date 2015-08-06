# [`departures(station[, options])`](../src/Client.js#L233)

**Queries the next departures at a station.**

`departures` returns a promise that will resolve with an `Array` of results.



## Example

```javascript
client.departures(9020202, {   // `id` for S Beusselstraße
	results: 4,
	products: {
		suburban: false
	}
}).then(function (results) {
	console.log(results);
});
```


## Output

Some stations consist of many substations (for example *Berlin Hauptbahnhof*), so `departures` will give you *all* departures from *all* substations. The `stop` field contains the `id` of the specific substation.

The `realtime` field doesn't always exist. For *express* trains, there is no `line` field!

```javascript
[
  {
    stop: 9020202,
    type: 'bus',
    line: '123',
    direction: 'Saatwinkler Damm Mäckeritzwiesen',
    when: Sat Aug 01 2015 18:13:00 GMT+0200 (CEST),   // `Date` object
    realtime: Sat Aug 01 2015 18:13:00 GMT+0200 (CEST)   // `Date` object
  }, {
    stop: 9020202,
    type: 'bus',
    line: '106',
    direction: 'U Seestr.',
    when: Sat Aug 01 2015 18:16:00 GMT+0200 (CEST),   // `Date` object
    realtime: Sat Aug 01 2015 18:23:00 GMT+0200 (CEST)   // `Date` object
  }, {
    stop: 9020202,
    type: 'bus',
    line: 'TXL',
    direction: 'Flughafen Tegel Airport',
    when: Sat Aug 01 2015 18:17:00 GMT+0200 (CEST)   // `Date` object
  }, {
    stop: 9020202,
    type: 'bus',
    line: '106',
    direction: 'Lindenhof via S Südkreuz',
    when: Sat Aug 01 2015 18:18:00 GMT+0200 (CEST),   // `Date` object
    realtime: Sat Aug 01 2015 18:19:00 GMT+0200 (CEST)   // `Date` object
  }
]
```



## `station`

Type: `Integer`; *Required*

The `id` of the station.



## `options`

Type: `Options`;

My contain any of the following options.

| options | default | type | description |
|:----------|:----|:-----|:------------|
| `apiKey` | `client.apiKey` | `String` | The [API key](http://www.vbb.de/de/article/webservices/schnittstellen-fuer-webentwickler/5070.html#testserver) to be used. |
| `results` | `10` | `Integer` | The number of results. |
| `when` | `new Date()` | `Date` | Self-explanatory. |
| `direction` | – | `Integer` | The `id` of the last station of the line. |
| `products` | – | `Object` | My contain any of the following transport products. |

| product | default | description |
|:----------|:----|:-----|:------------|
| `products.suburban` | `true` | If [S-Bahn trains](https://en.wikipedia.org/wiki/Berlin_S-Bahn) should be included in the results. |
| `products.subway` | `true` | If [U-Bahn trains](https://en.wikipedia.org/wiki/Berlin_U-Bahn) should be included in the results. |
| `products.tram` | `true` | If [tramway vehicles](https://en.wikipedia.org/wiki/Trams_in_Berlin) should be included in the results. |
| `products.bus` | `true` | If [buses](https://en.wikipedia.org/wiki/Bus_transport_in_Berlin) should be included in the results. |
| `products.ferry` | `true` | If [ferries](https://en.wikipedia.org/wiki/Ferry_transport_in_Berlin) should be included in the results. |
| `products.express` | `false` | If [IC](https://en.wikipedia.org/wiki/Intercity_%28Deutsche_Bahn%29)/[EC](https://en.wikipedia.org/wiki/EuroCity)/[ICE](https://en.wikipedia.org/wiki/Intercity-Express) should be included in the results. |
| `products.regional` | `true` | If [RE](https://en.wikipedia.org/wiki/Regional-Express)/[RB](https://en.wikipedia.org/wiki/Regionalbahn)/[IRE](https://en.wikipedia.org/wiki/Interregio-Express) trains should be included in the results. |
