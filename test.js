var _ = require('underscore');
var irMap = require('./settings/ir-map.js');

var arr = [];
console.log(_.map(irMap, function(target, num) {
	target = target instanceof Array ? target[0] : target;
	return {
		word: target,
		rule: {
			reply: target,
			api: target.replace(' ', '/')
		}
	};
}));
