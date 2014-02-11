var WeMo       = require('wemo');
var should     = require('should');
var async      = require('async');
var Settings   = require('../settings');
var wemoSwitch = new WeMo(Settings.WeMo.Switch.ip);

var WeMoError = function(err) {
	var e = new Error(err);
	e.name = 'WeMoError';
	return e;
};

describe('WeMo Switch', function() {
	it('set off', function(done) {
		wemoSwitch.setBinaryState(0, function(err, result) {
			if (err) throw WeMoError;
			result.should.equal('0');
			done();
		});
	});
	it('get off', function(done) {
		wemoSwitch.getBinaryState(function(err, result) {
			if (err) throw WeMoError;
			result.should.equal('0');
			done();
		});
	});
	it('set on', function(done) {
		wemoSwitch.setBinaryState(1, function(err, result) {
			if (err) throw WeMoError;
			result.should.equal('1');
			done();
		});
	});
	it('get on', function(done) {
		wemoSwitch.getBinaryState(function(err, result) {
			if (err) throw WeMoError;
			result.should.equal('1');
			done();
		});
	});
});
