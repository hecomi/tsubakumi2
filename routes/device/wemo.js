var WeMo = require('wemo');

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
};

WeMoHandler.prototype = {
	search: function(callback) {
		WeMo.Search(this.name, function(err, device) {
			if (err) throw err;
			this.ip   = device.ip;
			this.port = device.port;
			this.wemo = new WeMo(this.ip, this.port);
			if (typeof(callback) === 'function') callback();
		}.bind(this));
	},
	_callApi: function(api) {
		if (this.wemo === null) {
			this.search(api);
		} else {
			api();
		}
	},
	state: function(callback) {
		var self = this;
		this._callApi(function() {
			self.wemo.getBinaryState(function(err, result) {
				if (err) {
					self.search(callback);
					throw err;
				}
				callback(null, result);
			});
		});
	},
	on: function(callback) {
		var self = this;
		this._callApi(function() {
			self.wemo.setBinaryState(1, function(err, result) {
				if (err) {
					self.search(callback);
					throw err;
				}
				callback(null, result);
			});
		});
	},
	off: function(callback) {
		var self = this;
		this._callApi(function() {
			self.wemo.setBinaryState(0, function(err, result) {
				if (err) {
					self.search(callback);
					throw err;
				}
				callback(null, result);
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
			var wemo = target.handler = target.handler || new WeMoHandler(target);
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
			var wemo = target.handler = target.handler || new WeMoHandler(target);
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
