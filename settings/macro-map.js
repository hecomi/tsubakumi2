var request = require('request');
var _       = require('underscore');
var get     = require('../utilities').get;
var exec    = require('child_process').exec;

module.exports = {
	'restart': function(req, res) {
		exec('touch app.js', function(err, stdout) {
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
				var r = get('/projector/off');
				if (n === 1) r.pipe(res);
			}, 1000 * n);
		});
	},
	'projector/input/hdmi': function(req, res) {
		['source', 'up', 'enter'].forEach(function(api, n) {
			setTimeout(function() {
				var r = get('/projector/' + api);
				if (n === 2) r.pipe(res);
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
