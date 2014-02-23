var request  = require('request');
var settings = require('./settings')();

// Request API
exports.get = function(api, callback) {
	return request.get({
		url     : settings.address + api,
		json    : true,
		timeout : 2000
	}, function(err, res, json) {
		if (err) throw err;
		if (typeof(callback) === 'function') callback(json);
	});
};
