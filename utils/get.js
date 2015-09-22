var request = require('request');
var printf  = require('printf');
var timeout = 3000;

module.exports = (options, callback) => {
	var settings = require('../settings'); // circular dependency...

	if (!(options instanceof Object)) {
		options = { path: options };
	}
	var host = options.host || settings.host;
	var port = options.port || settings.port;
	var url = printf('http://%s:%s%s', host, port, options.path);

	return request.get(url, { timeouts: timeout }, (err, res, body) => {
		if (typeof(callback) === 'function') {
			if (err) {
				callback({ error: err });
				return;
			}
			try {
				callback(JSON.parse(body));
			} catch (e) {
				callback({ error: e });
			}
		}
	});
};
