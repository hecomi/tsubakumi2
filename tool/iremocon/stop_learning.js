var iRemocon = require('iremocon');
var settings = require('../../settings').iRemocon;

var iRemoconError = function(err) {
	var e = new Error('[' + err.code + '] ' + err.error);
	e.name = 'iRemoconError';
	return e;
};

var ir = new iRemocon(settings.ip);
ir.cc(function(err, result) {
	if (err) throw iRemoconError(err);
	console.log('ok');
});

