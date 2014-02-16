var request  = require('request');
var printf   = require('printf');
var _        = require('underscore');

var InvalidMacroError = function(msg) {
	var e = new Error(msg);
	e.name = 'InvalidMacroError';
	return e;
};

module.exports = function(app) {
	var macroMap = require('../../macro-map')(app);
	return function(req, res) {
		for (var url in macroMap) {
			console.log(url);
			if (req.params[0] === url) {
				macroMap[url](req, res);
				return;
			}
		}
		throw InvalidMacroError(printf('"%s" is not defined as Macro API', req.params[0]));
	};
};
