extend =		require('extend');





var locations = module.exports = {



	client: null



	init: function (client) {
		if (!client) throw new Error('Missing `client`.');
		this.client = client;

		return this;
	},



	_searchDefaults: {
		results:	10,
		stations:	true,
		addresses:	true,
		pois:		true,
		products: {
			suburban:	true,
			subway:		true,
			tram:		true,
			bus:		true,
			ferry:		true,
			express:	false,
			regional:	true
		}
	},

	search: function (query, options) {
		if (!query) throw new Error('Missing `query` parameter.');

		options = extend(true, {}, this._searchDefaults, options or {});

		params = {};   // todo: build params

		return this;
	},



};
