var fs     = require('fs');
var _      = require('underscore');
var ip     = require('ip');
var secret = require('./settings.secret');

var port = process.env.PORT || 23456;

module.exports = {
	port     : port,
	host     : ip.address(),
	address  : 'http://' + ip.address() + ':' + port + '/',
	command  : {
		app : 'pm2',
		option: '--node-args="--harmony" --watch',
		commands: _.extend(
			_.chain(fs.readdirSync('./services'))
			.filter(path => (path.indexOf('.js') != -1))
			.map(path => path.replace('.js', ''))
			.value().concat([
				'all',
			])
		)
	},
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
		test  : {
			checkIrNum : 999,  // テストする IR 番号
			isCheckIc  : false // 赤外線の学習のテストをするか
		}
	},
	WeMo: {
		// モニタのスイッチ
		switches : {
			monitor1: {
				name: 'WeMo Switch 1'
			},
			monitor2: {
				name: 'WeMo Switch 2'
			}
		},
		// 玄関
		motions : {
			entrance: {
				name: 'WeMo Motion 1'
			},
			toilet: {
				name: 'WeMo Motion 2'
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
		port: port + 1,
		address  : 'http://' + ip.address() + ':' + (port + 1) + '/',
	},
	websocket: {
		port: port + 2,
		address  : 'http://' + ip.address() + ':' + (port + 2) + '/',
	},
	gui: {
		port: port + 3
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
	},
	gcm: _.extend(secret.gcm, {
		messageTemplate: {
			title     : 'tsubakumi',
			summary   : '家電コントロールシステム',
			message   : 'メッセージはありません',
			largeIcon : 'https://avatars0.githubusercontent.com/u/493433?v=3&s=120',
		}
	})
};
