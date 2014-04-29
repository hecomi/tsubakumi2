var express  = require('express');
var app      = express();
var settings = require('./settings');

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
app.use(express.bodyParser());
app.use(app.router);
app.use(require('./middlewares/errorHandler.js'));

// Device APIs
// --------------------------------------------------------------------------------
var routes = require('./routes')(app);

// iRemocon
app.get('/device/iremocon/:api', routes.device.iremocon);
app.get('/device/iremocon/:api/:no([0-9]+)', routes.device.iremocon);
app.get('/device/iremocon/:api/*', routes.device.iremocon);

// WeMo
app.get('/device/wemo/switch/:target/:api', routes.device.wemo.switches);
app.get('/device/wemo/motion/:target/:api', routes.device.wemo.motions);

// hue
app.get('/device/hue/:api', routes.device.hue);
app.get('/device/hue/:api/:arg1', routes.device.hue);
app.get('/device/hue/:api/:arg1/:arg2', routes.device.hue);
app.get('/device/hue/:api/:arg1/:arg2/:arg3', routes.device.hue);

// device
app.get('/device/netatmo/:api', routes.device.netatmo);

// Macro APIs
// --------------------------------------------------------------------------------
app.get('/macro/*', routes.macro);

// Errors
// --------------------------------------------------------------------------------
app.get('/404', routes.notfound);

// Aliases
// --------------------------------------------------------------------------------
app.get('*', require('./routes/alias')(app));

// Start Server
// --------------------------------------------------------------------------------
app.listen(app.get('port'));
console.log('PORT:', app.get('port'));

// Unexpected Errors
// --------------------------------------------------------------------------------
process.on('uncaughtException', function(err) {
	console.error('UNCAUGHT EXCEPTION:', err);
});
