var settings = require('../settings');

// Utilities
// --------------------------------------------------------------------------------
var get   = require('../utilities').get;
var Timer = require('../utilities').Timer;

// TWE-Lite SerialPort
// --------------------------------------------------------------------------------
var serialport = require('serialport');
var SerialPort = serialport.SerialPort;
var parsers    = serialport.parsers;

var sp = new SerialPort(settings.twelite.port, {
	baudrate : 115200,
	parser   : parsers.readline('\r\n')
});

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
		type     : 'interval',
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
		type     : 'interval',
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
	{
		name : 'twelite',
		type : 'realtime',
		func : function() {
			sp.on('data', function(data) {
				console.log('[%s, %s] %s', 'twelite', new Date(), data);
				var json = {
					timestamp: +new Date()
				};
				var sensorData = {
					deviceId         : parseInt(data.substr(1,2)),
					command          : data.substr(3,2),
					packetId         : parseInt(data.substr(5,2)),
					protocolVersion  : data.substr(7,2),
					lqi              : data.substr(9,2),
					senderId         : data.substr(11,8),
					destId           : parseInt(data.substr(19,2)),
					timestamp        : data.substr(21,4),
					relayFlag        : data.substr(25,2),
					voltage          : data.substr(27,4),
					digitalInput     : data.substr(33,2),
					changeState      : data.substr(35,2),
					analogInputs     : [
						data.substr(37,2),
						data.substr(39,2),
						data.substr(41,2),
						data.substr(43,2)
					],
					analogCorrection : data.substr(45, 2),
					checkSum         : data.substr(47, 2)
				};
				json.sensorData = sensorData;

				switch (sensorData.deviceId) {
					case 2:
						break;
					case 3:
						json.buttons = [
							(sensorData.digitalInput & 0x8) > 0,
							(sensorData.digitalInput & 0x4) > 0,
							(sensorData.digitalInput & 0x2) > 0,
							(sensorData.digitalInput & 0x1) > 0
						];
						if (json.buttons[0]) {
							get('/all/light/off');
						}
						if (json.buttons[1]) {
							get('/all/light/on');
						}
						if (json.buttons[2]) {
							get('/aircon/off');
						}
						if (json.buttons[3]) {
							get('/aircon/on');
						}
						break;
				}

				var jsonStr = encodeURIComponent(JSON.stringify(json));
				get('/device/twelite/set/' + sensorData.deviceId + '/' + jsonStr);
			});
		}
	},
	// {
	// 	name     : 'aircon',
	//	type     : 'interval',
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
