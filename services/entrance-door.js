var settings = require('../settings');
var utils    = require('../utils');
var get      = utils.get;
var Android  = utils.Android;
var socket   = require('socket.io-client')(settings.websocket.address);

socket.on('twelight', data => {
	if (data.deviceId !== 2) return;

	if (data.digitalInput == '01') {
		Android.send({
			summary: 'ドアが開いた',
			message: '部屋をオフにしますか？',
			actions: [{
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
			}]
		});
	}
});
