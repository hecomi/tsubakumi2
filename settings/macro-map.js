var _       = require('underscore');
var get     = require('../utils').get;
var exec    = require('child_process').exec;

module.exports = {
	'restart': function(req, res) {
		exec('tsubakumi restart all', function(err, stdout) {
			if (err) throw err;
			res.jsonp({
				command: stdout,
				msg: 'restarted'
			});
		});
	},
	'projector/shutdown': function(req, res) {
		_(2).times(function(n) {
			setTimeout(function() {
				var callback = (n === 1) ? function(result) {
					res.jsonp(result);
				} : undefined;
				get('/projector/off', callback);
			}, 1000 * n);
		});
	},
	'projector/input/hdmi': function(req, res) {
		['source', 'up', 'enter'].forEach(function(api, n) {
			setTimeout(function() {
				var callback = (api === 'enter') ? function(result) {
					res.jsonp(result);
				} : undefined;
				get('/projector/' + api, callback);
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
				var callback = (api === '/ps3/○') ? function(result) {
					res.jsonp(result);
				} : undefined;
				get(api, callback);
			}, 500 * n);
		});
	}
};
