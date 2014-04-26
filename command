#!/Users/hecomi/.nodebrew/current/bin/node

var shell    = require('shell');
var app      = new shell();
var printf   = require('printf');
var exec     = require('child_process').exec;
var domain   = require('domain');
var settings = require('./settings');

var scripts = [
	'device.js',
	'event.js',
	'controller.js',
	'speech.js',
	'twitter.js',
	'mail.js'
];

var execScripts = function(command) {
	var d = domain.create();
	d.run(function() {
		scripts.forEach(function(script, index) {
			setTimeout(function() {
				exec(printf(command, script), function(err, stdout, stderr) {
					if (err) throw err;
					console.log('stdout > %s', stdout);
					console.error('stderr > %s', stderr);
				});
			}, index * 1000);
		});
	});
	d.on('error', function(err) {
		console.error(err.stack);
	});
};

app.configure(function() {
	app.use(shell.history({ shell: app }));
	app.use(shell.completer({ shell: app }));
	app.use(shell.router({ shell: app }));
	app.use(shell.help({
		shell: app,
		introduction: true
	}));
});

app.cmd('start', 'start all servers', function(req, res) {
	execScripts(settings.command + ' start %s');
	res.prompt();
});

app.cmd('restart', 'restart all servers', function(req, res) {
	execScripts(settings.command + ' restart %s');
	res.prompt();
});

app.cmd('stop', 'stop all servers', function(req, res) {
	execScripts(settings.command + ' stop %s');
	res.prompt();
});
