Client =	require('./Client');





var factory = module.exports = function (apiKey, endpoint) {
	var instance = Object.create(Client);
	instance.init(apiKey, endpoint);
	return instance;
};

factory.Client = Client;
