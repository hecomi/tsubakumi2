var settings = require('../settings');
var get = require('./get');

module.exports = (word, callback) => {
	return get({
		port: settings.controller.port,
		path: '/' + encodeURIComponent(word)
	}, callback);
};
