var WeMo     = require('wemo');
var printf   = require('printf');
var _        = require('underscore');
var socket   = require('../utils').websocket;
var settings = require('../settings').WeMo;
var switches = settings.switches;
var motions  = settings.motions;

var WeMoHandler = (key, name, type) => {
	this.name = name;
	this.address = printf('/device/wemo/%s/%s', type, key);
	this.wemo = null;
	this._isSearching = false;
	this._currentState = 0;

	this._init();
	this._update();
};

WeMoHandler.prototype = {
	// TODO: express のルーティングと統合したい
	_init: () => {
		var self = this;
		var callback = (err, result) => {
			socket.broadcast(self.address, {
				error  : err,
				state  : result || self._currentState,
				sender : __filename
			});
		};
		socket.on(this.address + '/on', msg => {
			if (msg && msg.sender === __filename) return;
			self.on(callback(msg));
		});
		socket.on(this.address + '/off', msg => {
			if (msg && msg.sender === __filename) return;
			self.off(callback(msg));
		});
		socket.on(this.address + '/state', msg => {
			if (msg && msg.sender === __filename) return;
			self.state(callback(msg));
		});
	},
	search: callback => {
		var callback = callback || () => {};

		if (this._isSearching) {
			var err = new Error('searching for ' + this.name);
			err.name = 'WeMoIsUnderSearchingError';
			callback(err);
			return;
		} else {
			if (this.wemo !== null) {
				callback();
				return;
			} else {
				this._isSearching = true;
				var self = this;
				WeMo.Search(this.name, (err, device) => {
					self._isSearching = false;
					if (err) {
						callback(err);
						return;
					}
					self.ip   = device.ip;
					self.port = device.port;
					self.wemo = new WeMo(self.ip, self.port);
					callback();
				});
			}
		}
	},
	query: options => {
		var method       = options.method;
		var state        = options.state;
		var callback     = options.callback  || () => {};
		var autoRetry    = options.autoRetry || false;
		options.retryNum = options.retryNum  || 0;
		var self = this;

		var retry = () => {
			self.wemo = null;
			options.retryNum++;
			self.query(options);
		};

		this.search(err => {
			if (err) {
				if (autoRetry && options.retryNum < settings.autoRetryMaxNum) {
					retry();
				} else {
					callback(err);
				}
				return;
			}
			switch (method) {
				case 'get':
					self.wemo.getBinaryState((err, result) => {
						if (err) {
							retry();
							return;
						}
						self._currentState = result;
						callback(err, result);
					});
					break;
				case 'set':
					self.wemo.setBinaryState(state, (err, result) => {
						if (err) {
							retry();
							return;
						}
						callback(err, result);
					});
					break;
			}
		});
	},
	state: callback => {
		this.query({
			method    : 'get',
			callback  : callback
		});
	},
	on: callback => {
		this.query({
			method    : 'set',
			state     : 1,
			callback  : callback,
			autoRetry : true
		});
	},
	off: callback => {
		this.query({
			method    : 'set',
			state     : 0,
			callback  : callback,
			autoRetry : true
		});
	},
	_update: () => {
		var self = this;
		this.state((err, result) => {
			setTimeout(() => {
				self._update();
			}, settings.updateInterval);
			if (err) {
				console.log(err);
				return;
			}
			socket.broadcast(self.address + '/state', {
				error  : err,
				state  : result,
				sender : __filename
			});
		});
	},
};

// スイッチ
for (var key in switches) {
	var wemo = new WeMoHandler(key, switches[key].name, 'switch');
}

// モーション
for (var key in motions) {
	var wemo = new WeMoHandler(key, motions[key].name, 'switch');
}

process.on('uncaughtException', err => {
	console.error(err.stack);
});
