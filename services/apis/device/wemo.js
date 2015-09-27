var printf   = require('printf');
var socket   = require('../../../utils').websocket;
var settings = require('../../../settings').WeMo;

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

// ---

var WeMoListener = (type, key) => {
	this._currentState = 0;
	this.address = printf('/device/wemo/%s/%s', type, key);
	this._init();
};

WeMoListener.prototype = {
	_init: () => {
		var self = this;
		socket.on(this.address + '/state', msg => {
			if (msg.error) {
				console.error(msg.error);
				return;
			}
			self._currentState = msg.state;
		});
	},
	state: callback => {
		callback(null, this._currentState);
	},
	request: (method, callback) => {
		socket.broadcast(this.address + '/' + method);
		callback(null, this._currentState);
	},
	on: callback => {
		this.request('on', callback);
	},
	off: callback => {
		this.request('off', callback);
	},
};

var switches = {};
var motions  = {};

// スイッチ
for (var key in settings.switches) {
	switches[key] = new WeMoListener('switch', key);
}

// モーション
for (var key in settings.motions) {
	motions[key] = new WeMoListener('switch', key);
}

// ---

var routes = (app, devices) => {
	return (req, res) => {
		var target = req.params.target;
		if (!(target in devices)) {
			throw new InvalidArgumentsError(target + ' is not registered as WeMo Switch device');
		}

		var api  = req.params.api;
		var wemo = devices[target];

		if (!(api in wemo)) {
			throw InvalidApiError('"' + req.params.api + '" is not WeMo API');
		}

		wemo[api]((err, state) => {
			if (err) throw err;
			res.jsonp({ state: state });
		});
	};
};

module.exports = app => {
	var api = routes(app);
	app.get('/device/wemo/switch/:target/:api', routes(app, switches));
	app.get('/device/wemo/motion/:target/:api', routes(app, motions));
};
