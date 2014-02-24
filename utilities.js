var settings = require('./settings');
var http = require('http');
http.globalAgent.maxSockets = 100;
var timeout = 3000;

// Request API
exports.get = function(api, callback) {
	var req = http.get({
		host : settings.host,
		port : settings.port,
		path : api
	}, function(res) {
		var json = '';
		res.on('data', function(chunk) {
			json += chunk.toString();
		});
		res.on('end', function(chunk) {
			if (typeof(callback) === 'function') {
				callback(JSON.parse(json));
			}
			req.end();
		});
	});
	req.setTimeout(timeout);
	req.on('timeout', function() {
		req.abort();
		throw new Error('TIMEOUT: ' + api, null);
	});
	req.on('error', function(err) {
		req.abort();
		throw err;
	});
	return req;
};

// Timer
var Timer = function() {
	this.timer = null;
};
Timer.prototype = {
	start: function(func, time) {
		if (this.timer !== null) {
			clearTimeout(this.timer);
		}
		this.timer = setTimeout(function() {
			func();
			this.timer = null;
		}, time);
	},
	stop: function() {
		if (this.timer !== null) {
			clearTimeout(this.timer);
			this.timer = null;
		}
	}
};
exports.Timer = Timer;

// Flag with Timer
FlagTimer = function(defaultFlag) {
	this.timer = new Timer();
	this.flag = defaultFlag;
};
FlagTimer.prototype = {
	set: function(flag, time) {
		this.timer.start(function() {
			this.flag = flag;
		}.bind(this), time);
	},
	get: function() {
		return this.flag;
	},
	stop: function() {
		this.timer.stop();
	}
};
exports.FlagTimer = FlagTimer;
