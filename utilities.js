var http = require('http');
http.globalAgent.maxSockets = 100;
var timeout = 3000;

// Device APIs
// --------------------------------------------------------------------------------
exports.get = function(options, callback) {
	if (!(options instanceof Object)) {
		options = { path: options };
	}
	var settings = require('./settings');
	var req = http.get({
		host : options.host || settings.host,
		port : options.port || settings.port,
		path : options.path
	}, function(res) {
		var chunks = [];
		res.on('data', function(chunk) {
			chunks.push(chunk);
		});
		res.on('end', function(chunk) {
			if (typeof(callback) === 'function') {
				try {
					callback(JSON.parse(chunks.join('')));
				} catch(e) {
					callback({ error: e });
				}
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

// query
// --------------------------------------------------------------------------------
exports.query = function(word, callback) {
	var settings = require('./settings');
	return exports.get({
		port: settings.controller.port,
		path: '/' + word
	}, callback);
};

// Timer
// --------------------------------------------------------------------------------
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
// --------------------------------------------------------------------------------
var FlagTimer = function(defaultFlag) {
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
