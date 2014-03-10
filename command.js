var shell  = require('shell');
var app    = new shell();
var printf = require('printf');
var exec   = require('child_process').exec;
var domain = require('domain');

var scripts = [
	'./device.js',
	'./event.js',
	'./controller.js',
	'./speech.js',
	'./twitter.js'
];

var execScripts = function(command) {
	var d = domain.create();
	d.run(function() {
		scripts.forEach(function(script) {
			exec(printf(command, script), function(err, stdout, stderr) {
				if (err) throw err;
				console.log('stdout > %s', stdout);
				console.error('stderr > %s', stderr);
			});
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
	execScripts('forever start %s');
	res.prompt();
});

app.cmd('restart', 'restart all servers', function(req, res) {
	execScripts('forever restart %s');
	res.prompt();
});

app.cmd('stop', 'stop all servers', function(req, res) {
	execScripts('forever stop %s');
	res.prompt();
});

app.cmd('debug', 'restart all servers', function(req, res) {
	execScripts('forever start %s -w');
	res.prompt();
});
