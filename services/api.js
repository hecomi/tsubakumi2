var express  = require('express');
var app      = express();
var settings = require('../settings');

// Settings
// --------------------------------------------------------------------------------
app.enable('jsonp callback');
for (var key in settings) {
	app.set(key, settings[key]);
}

// Middlewares
// --------------------------------------------------------------------------------
app.use(require('express-domain-middleware'));
app.use(express.logger());
app.use(express.favicon());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(app.router);
app.use(require('./middlewares/errorHandler.js'));

// Routings
// --------------------------------------------------------------------------------
var routes = require('./routes')(app);

// Errors
// --------------------------------------------------------------------------------
app.get('/404', (req, res) => {
	res.jsonp(404, { error: 'Not found' });
});

// Aliases
// --------------------------------------------------------------------------------
app.get('*', routes.alias);

// Start Server
// --------------------------------------------------------------------------------
app.listen(app.get('port'));
console.log('PORT:', app.get('port'));

// Unexpected Errors
// --------------------------------------------------------------------------------
process.on('uncaughtException', err => {
	console.error('UNCAUGHT EXCEPTION:', err);
});
