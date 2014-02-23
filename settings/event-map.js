var settings = require('../settings')();
var get      = require('../utilities').get;

// Parameters
var hallwayLightState = 0;

// Rules
module.exports = [
	{
		name     : 'hallway light',
		interval : 2000,
		func     : function() {
			get('/entrance/motion', function(json) {
				var newState = parseInt(json.state, 10);
				if (newState !== hallwayLightState) {
					hallwayLightState = newState;
					if (hallwayLightState === 1) {
						get('/hallway/light/on');
					} else {
						get('/hallway/light/off');
					}
				}
			});
		}
	}
];
