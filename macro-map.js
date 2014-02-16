var request = require('request');
var _       = require('underscore');

module.exports = function(app) {
	var get = function(api, callback) {
		return request.get({
			url  : app.get('address') + api,
			json : true
		}, function(err, res, json) {
			if (err) throw err;
			if (typeof(callback) === 'function') callback(json);
		});
	};

	return {
		'projector/shutdown': function(req, res) {
			_(2).times(function(n) {
				setTimeout(function() {
					var r = get('/projector/off');
					if (n === 1) r.pipe(res);
				}, 1000 * n);
			});
		},
		'ps3/torne': function(req, res) {
			[
				'/ps3/left',
				'/ps3/left',
				'/ps3/left',
				'/ps3/down',
				'/ps3/○'
			].forEach(function(api, n) {
				console.log(api);
				setTimeout(function() {
					var r = get(api);
					if (n === 4) r.pipe(res);
				}, 500 * n);
			});
		}
	};
};
