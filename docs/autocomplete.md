# [`locations(query[, results])`](../src/Client.js#L38)

**Fuzzy-finds stations** matching `query`.

`locations` returns a promise that will resolve with an `Array` with a length of `results`.



## Example

```javascript
client.autocomplete('Westend', {
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
		id: 9026207,
		name: 'S Westend (Berlin)'
	},
	{
		id: 9026101,
		name: 'U Neu-Westend (Berlin)'
	}
]
```



## `query`

Type: `String`; *Required*

Can be any query.



## `results`

Type: `Integer`; Default: `5`;

The number of results.
