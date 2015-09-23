var iRemocon = require('iRemocon');
var _        = require('underscore');
var irMap    = require('../../../settings/ir-map');

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

var iRemoconError = err => {
	var e = new Error('[' + err.code + '] ' + err.error);
	e.name = 'iRemoconError';
	return e;
};

var routes = app => {
	return (req, res) => {
		var ir = new iRemocon(app.get('iRemocon').ip);
		switch (req.params.api) {
			case 'list':
				res.jsonp(irMap);
				break;
			case 'ip':
				res.jsonp({ msg: ir.getIP() });
				break;
			case 'au':
				ir.au((err, result) => {
					if (err) throw iRemoconError(err);
					res.jsonp({ msg: result });
				});
				break;
			case 'is':
				if (!req.params.no && !req.params[0]) {
					throw InvalidArgumentsError('argument is undefined');
				}
				var namedMap = {};
				_.chain(irMap).invert().keys().each(keys => {
					keys.split(',').forEach(key => {
						namedMap[key.replace(/\s/g, '/')] = _.invert(irMap)[keys];
					});
				});
				var no = req.params.no || namedMap[req.params[0]];
				ir.is(no, (err, result) => {
					if (err) throw iRemoconError(err);
					res.jsonp({
						ir   : req.params.no,
						name : irMap[req.params.no],
						msg  : result
					});
				});
				break;
			case 'ic':
				if (!req.params.no && !req.params.name) {
					throw InvalidArgumentsError('argument is undefined');
				}
				ir.ic(no, (err, result) => {
					if (err) throw iRemoconError(err);
					console.log(result);
					res.jsonp({
						ir   : req.params.no,
						name : irMap[req.params.no],
						msg  : result
					});
				});
				break;
			case 'cc':
				ir.cc((err, result) => {
					if (err) throw iRemoconError(err);
					res.jsonp({
						ir   : req.params.no,
						name : irMap[req.params.no],
						msg  : result
					});
				});
				break;
			default:
				throw InvalidApiError('"' + req.params.api + '" is not iRemocon API');
		}
	};
};

module.exports = app => {
	var api = routes(app);
	app.get('/device/iremocon/:api', api);
	app.get('/device/iremocon/:api/:no([0-9]+)', api);
	app.get('/device/iremocon/:api/*', api);
};
