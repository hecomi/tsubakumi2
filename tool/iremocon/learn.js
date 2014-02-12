var settings = require('../../settings').iRemocon;
var irMap    = require('../../ir-map');
var iRemocon = require('iremocon');
var readline = require('readline');
var printf   = require('printf');
var opts     = require('opts');

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
var from = opts.get('from') || 0;
var to   = opts.get('to')   || irMap.length - 1;

// Learn IR Map
var learn = function(id) {
	if (id < from || id > to) {
		console.log('Done!');
		process.exit();
	}
	var signal = irMap[id];
	rl.question(printf('Learn "%s" [Y/n]', signal.name), function(answer) {
		switch (answer) {
			case '': case 'y': case 'Y':
				ir.ic(signal.id, function(err, result) {
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
