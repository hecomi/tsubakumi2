var printf   = require('printf');
var _        = require('underscore');

var InvalidMacroError = msg => {
	var e = new Error(msg);
	e.name = 'InvalidMacroError';
	return e;
};

var routes = app => {
	return (req, res) => {
		var macroMap = app.get('macroMap');
		for (var url in macroMap) {
			if (req.params[0] === url) {
				macroMap[url](req, res);
				return;
			}
		}
		throw InvalidMacroError(printf('"%s" is not defined as Macro API', req.params[0]));
	};
};

module.exports = app => {
	var api = routes(app);
	app.get('/macro/*', api);
};
