var _ = require('underscore');
var states = {};

var InvalidApiError = function(msg) {
	var e = new Error(msg);
	e.name = 'InvalidApiError';
	return e;
};

module.exports = function(app) {
	return function(req, res) {
		var api   = req.params.api;
		var id    = req.params.id;
		var value = req.params.value;

		switch (api) {
			case 'get':
				res.jsonp(states[id] || {});
				break;
			case 'set':
				states[id] = _.extend(
					JSON.parse(decodeURIComponent(value)),
					_.find(app.get('twelite').sensors, function(sensor) {
						return sensor.id == id;
					}));
				res.jsonp(states[id]);
				break;
			default:
				throw InvalidApiError('"' + api + '" is not TWE-Lite API');
		}
	};
};

