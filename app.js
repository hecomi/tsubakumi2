var express = require('express');
var app = express();
var fs = require('fs');

// Settings
// --------------------------------------------------------------------------------
app.enable('jsonp callback');
app.set('port', process.env.PORT || 23456);

// Middlewares
// --------------------------------------------------------------------------------
app.use(require('express-domain-middleware'));
app.use(express.logger());
app.use(express.favicon());
app.use(express.bodyParser());
app.use(app.router);
app.use(require('./middlewares/errorHandler.js'));

// APIs
// --------------------------------------------------------------------------------
var routes = require('./routes')(app);

// iRemocon
app.get('/iremocon/:api([a-z]+)',             routes.iremocon);
app.get('/iremocon/:api([a-z]+)/:no([0-9]+)', routes.iremocon);

// WeMo
app.get('/wemo/switch/:target/:api', routes.wemo.switches);
app.get('/wemo/motion/:target/:api', routes.wemo.motions);

// Start Server
// --------------------------------------------------------------------------------
app.listen(app.get('port'));
console.log('PORT:', app.get('port'));
