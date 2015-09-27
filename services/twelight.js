var settings = require('../settings');
var socket   = require('socket.io-client')(settings.websocket.address);
var get      = require('../utils').get;

var serialport = require('serialport');
var SerialPort = serialport.SerialPort;
var parsers    = serialport.parsers;

var sp = new SerialPort(settings.twelite.port, {
	baudrate : 115200,
	parser   : parsers.readline('\r\n')
});

sp.on('data', data => {
	console.log('[%s, %s] %s', 'twelite', new Date(), data);
	var json = {
		timestamp  : +new Date(),
		sensorData : {
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
		}
	};

	var sensorData = json.sensorData;

	socket.emit('broadcast', {
		address : '/device/twelite/set/' + sensorData.deviceId,
		data    : sensorData
	});

	var jsonStr = encodeURIComponent(JSON.stringify(json));
	get('/device/twelite/set/' + sensorData.deviceId + '/' + jsonStr);
});
