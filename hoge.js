var _ = require('underscore');
var irMap = require('./ir-map.js');

var result = {};
_.chain(irMap).invert().keys().each(function(keys) {
	keys.split(',').forEach(function(key) {
		result[key.replace(' ', '/')] = _.invert(irMap)[keys];
	});
});

console.log(result);
