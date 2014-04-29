var get   = require('../utilities').get;
var Timer = require('../utilities').Timer;

// Parameters
var Hallway = {
	lightState: 1,
	lightTimer: new Timer()
};
var Aircon = {
	temperature: 0
};

// Rules
module.exports = [
	{
		name     : 'hallway light',
		interval : 3000,
		func     : function() {
			get('/entrance/motion', function(json) {
				var newState = parseInt(json.state, 10);
				if (newState !== Hallway.lightState) {
					Hallway.lightState = newState;
					if (Hallway.lightState === 1) {
						Hallway.lightTimer.stop();
						get('/hallway/light/on');
					} else {
						Hallway.lightTimer.start(function() {
							get('/hallway/light/off');
							Hallway.lightTimer.start(function() {
								get('/hallway/light/off');
							}, 5000);
						}, 10000);
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
