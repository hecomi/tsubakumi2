var request  = require('request');
var printf   = require('printf');
var _        = require('underscore');

var InvalidMacroError = function(msg) {
	var e = new Error(msg);
	e.name = 'InvalidMacroError';
	return e;
};

module.exports = function(app) {
	return function(req, res) {
		for (var url in app.get('macroMap')) {
			console.log(url);
			if (req.params[0] === url) {
				app.get('macroMap')[url](req, res);
				return;
			}
		}
		throw InvalidMacroError(printf('"%s" is not defined as Macro API', req.params[0]));
	};
};
