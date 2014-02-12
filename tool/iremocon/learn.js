var settings = require('../../settings').iRemocon;
var irMap    = require('../../ir-map');
var iRemocon = require('iremocon');
var readline = require('readline');
var printf   = require('printf');

// iRemocon
var ir = new iRemocon(settings.ip);

// Readline interface
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
rl.setPrompt('iRemocon> ');

// Learn IR Map
var learn = function(id) {
	if (id < 0 || id > irMap.length - 1) {
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
learn(0);
