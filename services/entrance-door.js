var settings = require('../settings');

var utils   = require('../utils');
var get     = utils.get;
var Timer   = utils.Timer;
var Android = utils.Android;

var serialport = require('serialport');
var SerialPort = serialport.SerialPort;
var parsers    = serialport.parsers;

var sp = new SerialPort(settings.twelite.port, {
	baudrate : 115200,
	parser   : parsers.readline('\r\n')
}, false);

sp.open(err => {
	if (err) throw err;
	sp.on('data', onDataReceived);
});

var onDataReceived = data => {
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
			if (sensorData.digitalInput == '01') {
				Android.send({
					summary: 'ドアが開いた',
					message: '部屋をオフにしますか？',
					actions: [
						{
							title   : 'オフにする',
							command : 'get',
							value   : settings.address + '/all/off',
							icon    : 'ic_media_play'
						},
						{
							title   : 'オンにする',
							command : 'get',
							value   : settings.address + '/room/on',
							icon    : 'ic_media_play'
						},
						{
							title   : 'その他',
							command : 'voice',
							value   : {
								url     : settings.controller.address + '/%s',
								label   : 'コマンド入力',
								choices : ['ただいま', '行ってきます', 'すべての電気を消して', 'エアコン消して', 'モニタを消して'],
							},
							icon : 'ic_media_play'
						},
					]
				});
			}
			break;
		case 3:
			json.buttons = [
				(sensorData.digitalInput & 0x8) > 0,
				(sensorData.digitalInput & 0x4) > 0,
				(sensorData.digitalInput & 0x2) > 0,
				(sensorData.digitalInput & 0x1) > 0
			];
			if (json.buttons[0]) {
				get('/all/off');
			}
			if (json.buttons[1]) {
				get('/room/on');
			}
			if (json.buttons[2]) {
				get('/all/monitor/off');
			}
			if (json.buttons[3]) {
				get('/all/monitor/on');
			}
			break;
	}

	var jsonStr = encodeURIComponent(JSON.stringify(json));
	get('/device/twelite/set/' + sensorData.deviceId + '/' + jsonStr);
};
