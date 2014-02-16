var request = require('request');
var _       = require('underscore');

module.exports = function(app) {
	return {
		'projector/shutdown': function(req, res) {
			_(2).times(function(n) {
				setTimeout(function() {
					var req = request.get(app.get('address') + '/projector/off');
					if (n == 1) req.pipe(res);
				}, 1000 * n);
			});
		}
	};
};
