var iRemocon = require('iremocon');
var _        = require('underscore');

var base = '192.168.1.';

_.range(1, 254).forEach(function(num) {
	var ip = base + num;
	var ir = new iRemocon(ip);
	ir.au(function(err, result) {
		if (!err) {
			console.log('FOUND: %s', ip);
			process.exit();
		}
	});
});
