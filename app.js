var express  = require('express');
var app      = express();
var fs       = require('fs');
var settings = require('./settings');

// Settings
// --------------------------------------------------------------------------------
app.enable('jsonp callback');
app.set('port', process.env.PORT || 23456);
app.set('settings', settings);

// Middlewares
// --------------------------------------------------------------------------------
app.use(require('express-domain-middleware'));
app.use(express.logger());
app.use(express.favicon());
app.use(express.bodyParser());
app.use(app.router);
app.use(require('./middlewares/errorHandler.js'));

// Low Level APIs
// --------------------------------------------------------------------------------
var routes = require('./routes')(app);

// iRemocon
app.get('/device/iremocon/:api', routes.device.iremocon);
app.get('/device/iremocon/:api/:no([0-9]+)', routes.device.iremocon);

// WeMo
app.get('/device/wemo/switch/:target/:api', routes.device.wemo.switches);
app.get('/device/wemo/motion/:target/:api', routes.device.wemo.motions);

// High Level APIs
// --------------------------------------------------------------------------------
// Light
app.get('/place/room/light/:api', routes.place.room.light);
app.get('/place/room/light/:api/:arg', routes.place.room.light);

// Errors
// --------------------------------------------------------------------------------
app.get('*', routes.notfound);

// Start Server
// --------------------------------------------------------------------------------
app.listen(app.get('port'));
console.log('PORT:', app.get('port'));
