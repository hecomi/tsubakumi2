var get   = require('../utilities').get;
var Timer = require('../utilities').Timer;

// Parameters
// --------------------------------------------------------------------------------
var Hallway = {
	lightState    : 1,
	lightTimer    : new Timer(),
	checkInterval : 1000,
	onDuration    : 10000
};

var Toilet = {
	lightState    : 1,
	lightTimer    : new Timer(),
	checkInterval : 1000,
	onDuration    : 3000
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
		func     : function() {
			var onDetectMove = function() {
				Hallway.lightTimer.stop();
				get('/hallway/light/on');
			};
			var onLostMove = function() {
				Hallway.lightTimer.start(function() {
					get('/hallway/light/off');
				}, Hallway.onDuration);
			};

			get('/entrance/motion', function(json) {
				var newState = parseInt(json.results[0].result.state, 10);
				if (newState !== Hallway.lightState) {
					Hallway.lightState = newState;
					if (newState === 1) {
						onDetectMove();
					} else {
						onLostMove();
					}
				}
			});
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
					get('/toilet/light/on');
				};
				var onLostMove = function() {
					Toilet.lightTimer.start(function() {
						get('/toilet/light/off');
					}, Toilet.onDuration);
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
