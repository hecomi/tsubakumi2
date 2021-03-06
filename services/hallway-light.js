var utils  = require('../utils');
var get    = utils.get;
var socket = utils.websocket;
var Timer  = utils.Timer;
var colors = require('colors');

var timer    = new Timer();
var state    = 0;
var duration = 30;
var high     = '50,30,20';
var low      = '6,5,3';

socket.on('/entrance/motion', msg => {
	if (state !== msg.state) {
		state = msg.state;
		if (msg.state === 0) {
			onLostMove();
		} else {
			onDetectMove();
		}
	}
});

var onDetectMove = () => {
	timer.stop();
	get('/hallway/light/on', () => {
		get('/hallway/light/rgb/' + high);
	});
};

var onLostMove = () => {
	timer.start(() => {
		get('/hallway/light/rgb/' + low);
		timer.start(() => {
			get('/hallway/light/off');
		}, duration / 2 * 1000);
	}, duration / 2 * 1000);
};

setInterval(() => {
	if (state === 0 && timer.isRunning() === false) {
		get('/hallway/light/off');
	}
}, duration * 1000);

process.on('uncaughtException', err => {
	console.error(err.stack.red);
});
