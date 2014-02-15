var request = require('request');
var _       = require('underscore');

var redirect = function(res, url) {
	return function(req, res) {
		request.get(app.get('address') + url).pipe(res);
	};
};

module.exports = function(app) {
	var routes = {
		'mac/monitor/off': function(req, res) {
			var url = app.get('address') + '/device/wemo/monitor/off';
			request.get(url).pipe(res);
		},
		'mac/monitor/on': function(req, res) {
			var url = app.get('address') + '/device/wemo/monitor/on';
			request.get(url).pipe(res);
		},
	};
	return function(req, res) {
		if (req.params[0]);
	};
};
