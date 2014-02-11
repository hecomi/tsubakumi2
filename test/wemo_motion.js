var WeMo       = require('wemo');
var should     = require('should');
var async      = require('async');
var Settings   = require('../settings');
var wemoMotion = new WeMo(Settings.WeMo.motions.entrance.ip);

var WeMoError = function(err) {
	var e = new Error(err);
	e.name = 'WeMoError';
	return e;
};

describe('WeMo Motion', function() {
	this.timeout(10000);
	it('get off', function(done) {
		console.log('Please *DON\'T* move for 5 seconds.');
		setTimeout(function() {
			wemoMotion.getBinaryState(function(err, result) {
				if (err) throw WeMoError;
				result.should.equal('0');
				done();
			});
		}, 5000);
	});
	it('get on', function(done) {
		console.log('Please *MOVE* for 5 seconds.');
		setTimeout(function() {
			wemoMotion.getBinaryState(function(err, result) {
				if (err) throw WeMoError;
				result.should.equal('1');
				done();
			});
		}, 5000);
	});
});
