var settings = require('../../settings').iRemocon;
var irMap    = require('../../ir-map');
var iRemocon = require('iremocon');
var readline = require('readline');
var printf   = require('printf');
var opts     = require('opts');
var _        = require('underscore');

var ir = new iRemocon(settings.ip);
var rl = readline.createInterface({
	input  : process.stdin,
	output : process.stdout
});

// Parse command-line options
opts.parse([
	{
		short: 'f',
		long: 'from',
		description: 'learn from this index',
		value: true
	},
	{
		short: 't',
		long: 'to',
		description: 'learn to this index',
		value: true
	}
], true);
var sortedKeys = _.chain(irMap).keys().sortBy(function(key) {
	return parseInt(key);
});
var min  = parseInt(sortedKeys.first().value());
var max  = parseInt(sortedKeys.last().value());
var from = parseInt(opts.get('from')) || min;
var to   = parseInt(opts.get('to'))   || max;
if (from < min || to > max || to < from) {
	console.error('from ~ to must be %d ~ %d', min, max);
	process.exit();
}

console.log(to);

// Learn IR Map
var learn = function(id) {
	if (id < from || id > to) {
		console.log('Done!');
		process.exit();
	}
	if (irMap[id] === undefined && id < to) {
		learn(++id);
		return;
	}
	rl.question(printf('Learn "%s" [Y/n]', irMap[id]), function(answer) {
		switch (answer) {
			case '': case 'y': case 'Y':
				ir.ic(id, function(err, result) {
					if (err) console.error(err.code, err.error);
					console.log(result);
					learn(++id);
				});
				break;
			case 'n': case 'N':
				learn(++id);
				break;
			default:
				learn(id);
				break;
		}
	});
};
learn(from);
