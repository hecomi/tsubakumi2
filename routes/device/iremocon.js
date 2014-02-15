var iRemocon = require('iRemocon');
var _ = require('underscore');

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

var iRemoconError = function(err) {
	var e = new Error('[' + err.code + '] ' + err.error);
	e.name = 'iRemoconError';
	return e;
};

module.exports = function(app) {
	return function(req, res) {
		var ir = new iRemocon(app.get('iRemocon').ip);
		switch (req.params.api) {
			case 'list':
				res.jsonp(app.get('iRemocon').irMap);
				break;
			case 'ip':
				res.jsonp({ msg: ir.getIP() });
				break;
			case 'au':
				ir.au(function(err, result) {
					if (err) throw iRemoconError(err);
					res.jsonp({ msg: result });
				});
				break;
			case 'is':
				if (!req.params.no && !req.params[0]) {
					throw InvalidArgumentsError('argument is undefined');
				}
				var namedMap = {};
				_.chain(app.get('iRemocon').irMap).invert().keys().each(function(keys) {
					keys.split(',').forEach(function(key) {
						namedMap[key.replace(' ', '/')] = _.invert(app.get('iRemocon').irMap)[keys];
					});
				});
				var no = req.params.no || namedMap[req.params[0]];
				ir.is(no, function(err, result) {
					if (err) throw iRemoconError(err);
					res.jsonp({
						ir   : req.params.no,
						name : app.get('iRemocon').irMap[req.params.no],
						msg  : result
					});
				});
				break;
			case 'ic':
				if (!req.params.no && !req.params.name) {
					throw InvalidArgumentsError('argument is undefined');
				}
				ir.ic(no, function(err, result) {
					if (err) throw iRemoconError(err);
					console.log(result);
					res.jsonp({
						ir   : req.params.no,
						name : app.get('iRemocon').irMap[req.params.no],
						msg  : result
					});
				});
				break;
			case 'cc':
				ir.cc(function(err, result) {
					if (err) throw iRemoconError(err);
					res.jsonp({
						ir   : req.params.no,
						name : app.get('iRemocon').irMap[req.params.no],
						msg  : result
					});
				});
				break;
			default:
				throw InvalidApiError('"' + req.params.api + '" is not iRemocon API');
		}
	};
};
