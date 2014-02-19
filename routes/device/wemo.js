var WeMo = require('wemo');

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

module.exports = function(app) {
	return {
		switches: function(req, res) {
			var target = req.params.target;
			if (!(target in app.get('WeMo').switches)) {
				throw new InvalidArgumentsError(target + ' is not registered as WeMo Switch device');
			}
			var name = app.get('WeMo').switches[target].name;
			WeMo.Search(name, function(err, device) {
				if (err) throw err;
				var wemo = new WeMo(device.ip, device.port);
				switch (req.params.api) {
					case 'state':
						wemo.getBinaryState(function(err, result) {
							if (err) throw err;
							res.jsonp({ state: result });
						});
						break;
					case 'on':
						wemo.setBinaryState(1, function(err, result) {
							if (err) throw err;
							res.jsonp({ state: result });
						});
						break;
					case 'off':
						wemo.setBinaryState(0, function(err, result) {
							if (err) throw err;
							res.jsonp({ state: result });
						});
						break;
					default:
						throw InvalidApiError('"' + req.params.api + '" is not WeMo API');
				}
			});
		},
		motions: function(req, res) {
			var target = req.params.target;
			if (!(target in app.get('WeMo').motions)) {
				throw new InvalidArgumentsError(target + ' is not registered as WeMo Switch device');
			}
			var name = app.get('WeMo').motions[target].name;
			WeMo.Search(name, function(err, device) {
				if (err) throw err;
				var wemo = new WeMo(device.ip, device.port);
				switch (req.params.api) {
					case 'state':
						wemo.getBinaryState(function(err, result) {
							if (err) throw err;
							res.jsonp({ state: result });
						});
						break;
					default:
						throw InvalidApiError('"' + req.params.api + '" is not WeMo API');
				}
			});
		}
	};
};
