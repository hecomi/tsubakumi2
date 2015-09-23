var WeMo   = require('wemo');

var WeMoNotFoundError = (ip, port) => {
	var e = new Error('WeMo@' + ip + ':' + port + ' is not found');
	e.name = 'WeMoNotFoundError';
	return e;
};

var InvalidArgumentsError = msg => {
	var e = new Error(msg);
	e.name = 'InvalidArgumentsError';
	return e;
};

var InvalidApiError = msg => {
	var e = new Error(msg);
	e.name = 'InvalidApiError';
	return e;
};

var WeMoHandler = target => {
	this.target = target;
	this.name   = target.name;
	this.wemo   = null;
	this.isSearching = false;
};

WeMoHandler.prototype = {
	search: callback => {
		if (!this.isSearching && this.wemo !== null) {
			callback();
			return;
		}
		if (!this.isSearching && this.wemo === null) {
			this.isSearching = true;
			var self = this;
			WeMo.Search(this.name, (err, device) => {
				self.isSearching = false;
				if (err) return;
				self.ip   = device.ip;
				self.port = device.port;
				self.wemo = new WeMo(self.ip, self.port);
			});
		}
		if (typeof(callback) === 'function') {
			callback(new Error(this.name + ' has not been found yet'));
		}
	},
	state: callback => {
		var self = this;
		this.search(err => {
			if (err) {
				callback(err);
				return;
			}
			self.wemo.getBinaryState((err, result) => {
				if (err) { self.wemo = null; }
				callback(err, result);
			});
		});
	},
	on: callback => {
		var self = this;
		this.search(err => {
			if (err) {
				callback(err);
				return;
			}
			self.wemo.setBinaryState(1, (err, result) => {
				if (err) { self.wemo = null; }
				callback(err, result);
			});
		});
	},
	off: callback => {
		var self = this;
		this.search(err => {
			if (err) {
				callback(err);
				return;
			}
			self.wemo.setBinaryState(0, (err, result) => {
				if (err) { self.wemo = null; }
				callback(err, result);
			});
		});
	}
};

var routes = app => {
	return {
		switches: (req, res) => {
			var target = req.params.target;
			if (!(target in app.get('WeMo').switches)) {
				throw new InvalidArgumentsError(target + ' is not registered as WeMo Switch device');
			}

			var target = app.get('WeMo').switches[target];
			target.handler = target.handler || new WeMoHandler(target);
			var wemo = target.handler;

			switch (req.params.api) {
				case 'state':
					wemo.state((err,result) => {
						if (err) throw err;
						res.jsonp({ state: result });
					});
					break;
				case 'on':
					wemo.on((err,result) => {
						if (err) throw err;
						res.jsonp({ state: result });
					});
					break;
				case 'off':
					wemo.off((err,result) => {
						if (err) throw err;
						res.jsonp({ state: result });
					});
					break;
				default:
					throw InvalidApiError('"' + req.params.api + '" is not WeMo API');
			}
		},

		motions: (req, res) => {
			var target = req.params.target;

			if (!(target in app.get('WeMo').motions)) {
				throw new InvalidArgumentsError(target + ' is not registered as WeMo Switch device');
			}

			var target = app.get('WeMo').motions[target];
			target.handler = target.handler || new WeMoHandler(target);
			var wemo = target.handler;

			switch (req.params.api) {
				case 'state':
					wemo.state((err, result) => {
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

module.exports = app => {
	var api = routes(app);
	app.get('/device/wemo/switch/:target/:api', api.switches);
	app.get('/device/wemo/motion/:target/:api', api.motions);
};
