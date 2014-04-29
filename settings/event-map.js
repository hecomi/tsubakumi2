var get   = require('../utilities').get;
var Timer = require('../utilities').Timer;

// Parameters
var hallwayLightState = 1;
var hallwayTimer = new Timer();

// Rules
module.exports = [
	{
		name     : 'hallway light',
		interval : 3000,
		func     : function() {
			get('/entrance/motion', function(json) {
				var newState = parseInt(json.state, 10);
				if (newState !== hallwayLightState) {
					hallwayLightState = newState;
					if (hallwayLightState === 1) {
						hallwayTimer.stop();
						get('/hallway/light/on');
					} else {
						hallwayTimer.start(function() {
							get('/hallway/light/off');
							hallwayTimer.start(function() {
								get('/hallway/light/off');
							}, 5000);
						}, 10000);
					}
				}
			});
		}
	}
];
