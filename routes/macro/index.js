var request = require('request');
var printf  = require('printf');
var _       = require('underscore');

var InvalidMacroError = function(msg) {
	var e = new Error(msg);
	e.name = 'InvalidMacroError';
	return e;
};

var redirect = function(res, url) {
	return function(req, res) {
		request.get(app.get('address') + url).pipe(res);
	};
};

module.exports = function(app) {
	return function(req, res) {
		var routes = {
			'projector/shutdown': function() {
				_(2).times(function(n) {
					setTimeout(function() {
						var req = request.get(app.get('address') + '/projector/off');
						if (n == 1) req.pipe(res);
					}, 1000 * n);
				});
			}
		};
		for (var macro in routes) {
			if (req.params[0] === macro) {
				routes[macro](req.params[0]);
				return;
			}
		}
		throw InvalidMacroError(printf('"%s" is not defined as Macro API', req.params[0]));
	};
};
