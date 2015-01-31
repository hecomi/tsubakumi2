var ip     = require('ip');
var secret = require('./settings/settings.secret');

var port = process.env.PORT || 23456;

module.exports = {
	port     : port,
	host     : ip.address(),
	address  : 'http://' + ip.address() + ':' + port,
	aliasMap : require('./settings/alias-map'),
	macroMap : require('./settings/macro-map'),
	command  : 'pm2',
	DB: {
		host        : 'localhost',
		port        : 27017,
		dbName      : 'tsubakumi',
		collections : {
			ir: 'ir'
		}
	},
	iRemocon: {
		ip    : '192.168.0.4',
		irMap : require('./settings/ir-map'),
		test  : {
			checkIrNum : 999,  // テストする IR 番号
			isCheckIc  : false // 赤外線の学習のテストをするか
		}
	},
	WeMo: {
		// モニタのスイッチ
		switches : {
			monitor: {
				name: 'Hecomi WeMo Switch 1'
			}
		},
		// 玄関
		motions : {
			entrance: {
				name: 'Hecomi WeMo Motion 1'
			},
			toilet: {
				name: 'Hecomi WeMo Motion 2'
			}
		}
	},
	hue: {
		id   : '001788fffe15ccd4',
		ip   : '192.168.0.6',
		user : secret.hue.user
	},
	netatmo : secret.netatmo,
	twitter : secret.twitter,
	gmail   : secret.gmail,
	controller: {
		port: port + 1
	},
	websocket: {
		port: port + 2
	},
	twelite: {
		port: '/dev/tty.usbserial-AHXU1CX2',
		sensors: [
			{
				id    : 1,
				type  : 'host',
				place : 'server'
			},
			{
				id    : 2,
				type  : '1-sensor',
				place : 'entrance'
			},
			{
				id    : 3,
				type  : '4-switch',
				place : 'bed'
			},
		]
	}
};
