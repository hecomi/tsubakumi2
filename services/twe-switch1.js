var utils  = require('../utils');
var socket = utils.websocket;
var get    = utils.get;

socket.on('/device/twelite/set/3', data => {
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
