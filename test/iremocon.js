var iRemocon = require('iremocon');
var should   = require('should');
var settings = require('../settings').iRemocon;

var ir = new iRemocon(settings.ip);

describe('iRemocon', function() {
	this.timeout(3000);

	it('should be found', function(done) {
		ir.au(function(err, msg) {
			if (err) throw new Error(err.code + ':' + err.error);
			done();
		});
	});

	(settings.test.isCheckIc ? it : it.skip)(
		'should receive IR (num: 999)', function(done) {
		this.timeout(30000);
		console.log('Please emit IR to iRemocon');
		ir.ic(settings.test.checkIrNum, function(err, msg) {
			if (err) throw new Error(err.code + ':' + err.error);
			done();
		});
	});

	it('should emit IR (num: 999)', function(done) {
		ir.is(settings.test.checkIrNum, function(err, msg) {
			if (err) throw new Error(err.code + ':' + err.error);
			done();
		});
	});
});

