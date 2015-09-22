var utils  = require('../utils');
var get    = utils.get;
var Timer  = utils.Timer;
var colors = require('colors');
var domain = require('domain');
var d      = domain.create();

var Toilet = {
	lightState    : 1,
	lightTimer    : new Timer(),
	checkInterval : 1,
	onDuration    : 180,
	high          : '50,30,20',
	low           : '6,5,3',
	count         : 0,
};

d.run(() => {
	setInterval(() => {
		get('/toilet/motion', json => {
			if (json.error) throw json.error;

			var onDetectMove = () => {
				Toilet.lightTimer.stop();
				get('/toilet/light/on', () => {
					get('/toilet/light/rgb/' + Toilet.high);
				});
			};
			var onLostMove = () => {
				Toilet.lightTimer.start(() => {
					get('/toilet/light/rgb/' + Toilet.low);
					Toilet.lightTimer.start(() => {
						get('/toilet/light/off');
					}, Toilet.onDuration / 2 * 1000);
				}, Toilet.onDuration / 2 * 1000);
			};

			var newState = parseInt(json.results[0].result.state, 10);
			if (newState !== Toilet.lightState) {
				Toilet.lightState = newState;
				if (newState === 1) {
					onDetectMove();
				} else {
					onLostMove();
				}
			}
		});
	}, Toilet.checkInterval * 1000);
});

d.on('error', err => {
	console.error('ERROR: %s'.red, err.code);
});
