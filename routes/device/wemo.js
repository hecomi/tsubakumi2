var WeMo   = require('wemo');

var WeMoNotFoundError = function(ip, port) {
	var e = new Error('WeMo@' + ip + ':' + port + ' is not found');
	e.name = 'WeMoNotFoundError';
	return e;
};

var InvalidArgumentsError = function(msg) {
	var e = new Error(msg);
	e.name = 'InvalidArgumentsError';
	return e;
};

var InvalidApiError = function(msg) {
	var e = new Error(msg);
	e.name = 'InvalidApiError';
	return e;
};

var WeMoHandler = function(target) {
	this.target = target;
	this.name   = target.name;
	this.wemo   = null;
	this.isSearching = false;
};

WeMoHandler.prototype = {
	search: function(callback) {
		if (!this.isSearching && this.wemo !== null) {
			callback();
			return;
		}
		if (!this.isSearching && this.wemo === null) {
			this.isSearching = true;
			WeMo.Search(this.name, function(err, device) {
				this.isSearching = false;
				if (err) return;
				this.ip   = device.ip;
				this.port = device.port;
				this.wemo = new WeMo(this.ip, this.port);
			}.bind(this));
		}
		if (typeof(callback) === 'function') {
			callback(new Error(this.name + ' has not been found yet'));
		}
	},
	state: function(callback) {
		var self = this;
		this.search(function(err) {
			if (err) {
				callback(err);
				return;
			}
			self.wemo.getBinaryState(function(err, result) {
				if (err) { self.wemo = null; }
				callback(err, result);
			});
		});
	},
	on: function(callback) {
		var self = this;
		this.search(function(err) {
			if (err) {
				callback(err);
				return;
			}
			self.wemo.setBinaryState(1, function(err, result) {
				if (err) { self.wemo = null; }
				callback(err, result);
			});
		});
	},
	off: function(callback) {
		var self = this;
		this.search(function(err) {
			if (err) {
				callback(err);
				return;
			}
			self.wemo.setBinaryState(0, function(err, result) {
				if (err) { self.wemo = null; }
				callback(err, result);
			});
		});
	}
};

module.exports = function(app) {
	return {
		switches: function(req, res) {
			var target = req.params.target;
			if (!(target in app.get('WeMo').switches)) {
				throw new InvalidArgumentsError(target + ' is not registered as WeMo Switch device');
			}

			var target = app.get('WeMo').switches[target];
			target.handler = target.handler || new WeMoHandler(target);
			var wemo = target.handler;

			switch (req.params.api) {
				case 'state':
					wemo.state(function(err,result) {
						if (err) throw err;
						res.jsonp({ state: result });
					});
					break;
				case 'on':
					wemo.on(function(err,result) {
						if (err) throw err;
						res.jsonp({ state: result });
					});
					break;
				case 'off':
					wemo.off(function(err,result) {
						if (err) throw err;
						res.jsonp({ state: result });
					});
					break;
				default:
					throw InvalidApiError('"' + req.params.api + '" is not WeMo API');
			}
		},

		motions: function(req, res) {
			var target = req.params.target;

			if (!(target in app.get('WeMo').motions)) {
				throw new InvalidArgumentsError(target + ' is not registered as WeMo Switch device');
			}

			var target = app.get('WeMo').motions[target];
			target.handler = target.handler || new WeMoHandler(target);
			var wemo = target.handler;

			switch (req.params.api) {
				case 'state':
					wemo.state(function(err,result) {
						if (err) throw err;
						res.jsonp({ state: result });
					});
					break;
				default:
					throw InvalidApiError('"' + req.params.api + '" is not WeMo API');
			}
		}
	};
};
