var settings = require('../settings').websocket;
var get      = require('../utils').get;
var socket   = require('socket.io-client')(settings.address);

socket.on('twelight', data => {
	if (data.deviceId !== 3) return;

	var buttons = [
		(data.digitalInput & 0x8) > 0,
		(data.digitalInput & 0x4) > 0,
		(data.digitalInput & 0x2) > 0,
		(data.digitalInput & 0x1) > 0
	];

	if (buttons[0]) {
		get('/all/off');
	}
	if (buttons[1]) {
		get('/room/on');
	}
	if (buttons[2]) {
		get('/all/monitor/off');
	}
	if (buttons[3]) {
		get('/all/monitor/on');
	}
});
