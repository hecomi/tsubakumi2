var _        = require('underscore');
var settings = require('../settings').websocket;
var socket   = require('socket.io-client')(settings.address);

module.exports = _.extend(socket, {
	broadcast: (address, data) => {
		socket.emit('broadcast', {
			address : address,
			data    : data
		});
	}
});

