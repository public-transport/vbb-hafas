//extend =		require('extend');





var journeys = module.exports = {



	client: null,



	init: function (client) {
		if (!client) throw new Error('Missing `client`.');
		this.client = client;

		return this;
	},



	// todo



};
