Client =	require('./Client');





var factory = module.exports = function (accessId, endpoint) {
	instance = Object.create(factory.Client);
	instance.init(accessId, endpoint);
	return instance;
}

factory.Client = Client;
