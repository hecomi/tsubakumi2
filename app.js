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
app.get('/iremocon/:api', routes.iremocon);

// Start Server
// --------------------------------------------------------------------------------
app.listen(app.get('port'));
console.log('PORT:', app.get('port'));
