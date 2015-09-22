var spawn    = require('child_process').spawn;
var colors   = require('colors');
var settings = require('../settings');

var pm2gui = spawn('pm2-gui', [
	'start',
	settings.gui.port
], {
	cwd: __dirname
}, err => {
	if (err) throw err;
});

pm2gui.stdout.on('data', data => { console.log(data.toString().gray);  });
pm2gui.stderr.on('data', data => { console.error(data.toString().red); });
