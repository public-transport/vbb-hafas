Client =	require('./Client');





var factory = module.exports = function (apiKey, endpoint) {
	instance = Object.create(factory.Client);
	instance.init(apiKey, endpoint);
	return instance;
}

factory.Client = Client;
