# [`routes(options)`](../src/Client.js#L136)

**Finds routes between `from` and `to`.**

`routes` returns a promise that will resolve with an `Array` of results.



## Example

```javascript
client.routes({
	from: 9026101,   // `id` for U Neu-Westend
	// GPS coordinates for S Westend
	toLatitude: 52.518613,
	toLongitude: 13.28424,
	via: 9024106,   // `id` for S Messe Nord/ICC
	results: 1,
	when: new Date('August 1, 2015 17:11:30')
}).then(function (results) {
	console.log(results);
});
```


## Output

For *express* trains, there is no `line` field!

```javascript
[
  {
    duration: 1080000,   // milliseconds
    parts: [

      {
        from: {
          title: 'U Neu-Westend (Berlin)',
          latitude: 52.516411,
          longitude: 13.259907,
          id: 9026101,
          type: 'station',
          notes: {},
          when: Sat Aug 01 2015 17:05:00 GMT+0200 (CEST)   // `Date` object
        },

        to: {
          title: 'Masurenallee/ZOB (Berlin)',
          latitude: 52.506729,
          longitude: 13.278784,
          id: 9026208,
          type: 'station',
          when: Sat Aug 01 2015 17:10:00 GMT+0200 (CEST)   // `Date` object
        },

        transport: 'public',
        direction: 'Stralau, Tunnelstr.',
        type: 'bus',
        line: '104',
        notes: {}
      },


      // …

      {
        from: {
          title: 'S Westend (Berlin)',
          latitude: 52.518613,
          longitude: 13.28424,
          id: 9026207,
          type: 'station',
          notes: { lift: true, tactilePaving: true, escalator: true },
          when: Sat Aug 01 2015 17:21:00 GMT+0200 (CEST)
        },

        to: {
          title: '14059 Berlin-Charlottenburg, Spandauer-Damm-Brücke 90',
          latitude: 52.518721,
          longitude: 13.284663,
          type: 'address',
          when: Sat Aug 01 2015 17:23:00 GMT+0200 (CEST)
        },

        transport: 'walk'
      }
    ],
    tickets:[
      {
        name: 'Einzelfahrausweis Regeltarif',
        price: 2.7,
        zone: 'Berlin Tarifgebiet A-B'
      }, {
        name: 'Einzelfahrausweis Ermäßigungstarif',
        price: 1.7,
        zone: 'Berlin Tarifgebiet A-B'
      }, {
        name: 'Tageskarte Regeltarif',
        price: 6.9,
        zone: 'Berlin Tarifgebiet A-B'
      }, {
        name: 'Tageskarte Ermäßigungstarif',
        price: 4.7,
        zone: 'Berlin Tarifgebiet A-B'
      }, {
        name: 'Kleingruppen- Tageskarte',
        price: 16.9,
        zone: 'Berlin Tarifgebiet A-B'
      }, {
        name: 'Gruppentageskarte Schüler',
        price: 3.2,
        zone: 'Berlin Tarifgebiet A-B'
      }, {
        name: '4-Fahrten-Karte Regeltarif',
        price: 9,
        zone: 'Berlin Tarifgebiet A-B'
      }, {
        name: '4-Fahrten-Karte Ermäßigungstarif',
        price: 5.6,
        zone: 'Berlin Tarifgebiet A-B'
      }
    ]
  }
]
```



## `options`

Type: `Options`; *Required*

My contain any of the following options. **Either `from` or `fromLatitude` and `fromLongitude` and either `to` or `toLatitude` and `toLongitude` must be passed.**

| options | default | type | description |
|:----------|:----|:-----|:------------|
| `apiKey` | `client.apiKey` | `String` | The [API key](http://www.vbb.de/de/article/webservices/schnittstellen-fuer-webentwickler/5070.html#testserver) to be used. |
| `from` | – | `Integer` | The `id` of the start location. *Required* |
| `fromLatitude` | – | `Float` | The GPS latitude of the start location. *Required* |
| `fromLongitude` | – | `Float` | The GPS longitude of the start location. *Required* |
| `to` | – | `Integer` | The `id` of the destination. *Required* |
| `toLatitude` | – | `Float` | The GPS latitude of the destination. *Required* |
| `toLongitude` | – | `Float` | The GPS longitude of the destination. *Required* |
| `via` | – | `Integer` | The `id` of a waypoint location. |
| `results` | `4` | `Integer` | The number of results, limited to `6` by HAFAS. |
| `when` | `new Date()` | `Date` | Self-explanatory. |
| `changes` | – | `Integer` | The maximum number of changes, limited to `3` by HAFAS. |
| `changeTimeFactor` | `1` | `Float` | The walking speed, between `1` and `5`. `5` represents 5 times more changing time. |
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
