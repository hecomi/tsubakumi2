var utils  = require('../utils');
var get    = utils.get;
var Timer  = utils.Timer;
var colors = require('colors');
var domain = require('domain');
var d      = domain.create();

var Hallway = {
	lightState    : 1,
	lightTimer    : new Timer(),
	checkInterval : 1,
	onDuration    : 30,
	high          : '50,30,20',
	low           : '6,5,3',
	count         : 0,
};

d.run(() => {
	setInterval(() => {
		var onDetectMove = () => {
			Hallway.lightTimer.stop();
			get('/hallway/light/on', () => {
				get('/hallway/light/rgb/' + Hallway.high);
			});
		};
		var onLostMove = () => {
			Hallway.lightTimer.start(() => {
				get('/hallway/light/rgb/' + Hallway.low);
				Hallway.lightTimer.start(() => {
					get('/hallway/light/off');
				}, Hallway.onDuration / 2 * 1000);
			}, Hallway.onDuration / 2 * 1000);
		};

		get('/entrance/motion', json => {
			if (json.error) throw json.error;

			var newState = parseInt(json.results[0].result.state, 10);
			if (newState !== Hallway.lightState ||
				Hallway.count % (Hallway.onDuration / Hallway.checkInterval) === 0) {
				Hallway.lightState = newState;
				if (newState === 1) {
					onDetectMove();
				} else {
					onLostMove();
				}
			}
		});

		++Hallway.count;
	}, Hallway.checkInterval * 1000);
});

d.on('error', err => {
	console.error('ERROR: %s'.red, err.code);
});
