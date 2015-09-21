#!/Users/hecomi/.nodebrew/current/bin/node

var shell    = require('shell');
var app      = new shell();
var printf   = require('printf');
var exec     = require('child_process').exec;
var domain   = require('domain');
var settings = require('./settings');

var scripts = [
	'all',
	'device',
	'event',
	'controller',
	'speech',
	'twitter',
	'mail'
];

var run = function(res, command, script) {
	if (scripts.indexOf(script) == -1) {
		res.red('command "' + script + '" is not exist.\n');
		res.print('available commands are:\n');
		scripts.forEach(function(script) {
			res.cyan(script + '\n');
		});
		res.prompt();
		return;
	}

	if (script === 'all') {
		scripts.forEach(function(script) {
			if (script == 'all') return;
			run(res, command, script);
		});
		return;
	}

	var d = domain.create();
	d.run(function() {
		exec(printf(command, script), function(err, stdout, stderr) {
			if (err) throw err;
			if (stdout) res.green(stdout.green);
			if (stderr) res.red(stderr.red);
			res.prompt();
		});
	});

	d.on('error', function(err) {
		res.red(err.stack);
		res.prompt();
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

app.cmd('start :script', 'start service', function(req, res) {
	run(res, settings.command + ' start %s.js', req.params.script);
});

app.cmd('restart :script', 'restart all servers', function(req, res) {
	run(res, settings.command + ' restart %s.js', req.params.script);
});

app.cmd('stop :script', 'stop all servers', function(req, res) {
	run(res, settings.command + ' stop %s.js', req.params.script);
});
