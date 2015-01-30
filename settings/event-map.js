var get   = require('../utilities').get;
var Timer = require('../utilities').Timer;

// Parameters
// --------------------------------------------------------------------------------
var Hallway = {
	lightState    : 1,
	lightTimer    : new Timer(),
	checkInterval : 1,
	onDuration    : 30
};

var Toilet = {
	lightState    : 1,
	lightTimer    : new Timer(),
	checkInterval : 1,
	onDuration    : 60
};

var Aircon = {
	temperature: 0
};

// Rules
// --------------------------------------------------------------------------------
module.exports = [
	{
		name     : 'hallway light',
		interval : Hallway.checkInterval,
		count    : 0,
		func     : function() {
			var onDetectMove = function() {
				Hallway.lightTimer.stop();
				get('/hallway/light/on', function() {
					get('/hallway/light/rgb/200,200,200');
				});
			};
			var onLostMove = function() {
				Hallway.lightTimer.start(function() {
					get('/hallway/light/rgb/100,100,100');
					Hallway.lightTimer.start(function() {
						get('/hallway/light/off');
					}, Hallway.onDuration / 2 * 1000);
				}, Hallway.onDuration / 2 * 1000);
			};

			var self = this;
			get('/entrance/motion', function(json) {
				var newState = parseInt(json.results[0].result.state, 10);
				if (newState !== Hallway.lightState ||
					self.count % (Hallway.onDuration / Hallway.checkInterval) === 0) {
					Hallway.lightState = newState;
					if (newState === 1) {
						onDetectMove();
					} else {
						onLostMove();
					}
				}
			});

			++this.count;
		}
	},
	{
		name     : 'toilet light',
		interval : Toilet.checkInterval,
		func     : function() {
			get('/toilet/motion', function(json) {
				if (json.error) throw json.error;

				var onDetectMove = function() {
					Toilet.lightTimer.stop();
					get('/toilet/light/on', function() {
						get('/toilet/light/rgb/200,200,200');
					});
				};
				var onLostMove = function() {
					Toilet.lightTimer.start(function() {
						get('/toilet/light/rgb/100,100,100');
						Toilet.lightTimer.start(function() {
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
		}
	},
	// {
	// 	name     : 'aircon',
	// 	interval : 1000 * 60 * 3, // 3 min
	// 	func     : function() {
	// 		get('/device/netatmo/room', function(json) {
	// 			var temp = parseInt(json.temperature, 10);
	// 			if (temp > 30) {
	// 				get('/aircon/degree/26', function(json) {
	// 					Aircon.temperature = 26;
	// 				});
	// 			}
	// 			if (temp < 15) {
	// 				get('/aircon/degree/20', function(json) {
	// 					Aircon.temperature = 20;
	// 				});
	// 			}
	// 			if (temp <= 26 && Aircon.temperature === 26) {
	// 				get('/aircon/off');
	// 			}
	// 			if (temp >= 20 && Aircon.temperature === 20) {
	// 				get('/aircon/off');
	// 			}
	// 		});
	// 	}
	// }
];
