var ip     = require('ip');
var secret = require('./settings/settings.secret');

var port = process.env.PORT || 23456;
module.exports = {
	port     : port,
	host     : ip.address(),
	address  : 'http://' + ip.address() + ':' + port,
	aliasMap : require('./settings/alias-map'),
	macroMap : require('./settings/macro-map'),
	DB: {
		host        : 'localhost',
		port        : 27017,
		dbName      : 'tsubakumi',
		collections : {
			ir: 'ir'
		}
	},
	iRemocon: {
		ip    : '192.168.0.12',
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
			}
		}
	},
	hue: {
		id   : '001788fffe15ccd4',
		ip   : '192.168.0.8',
		user : secret.hue.user
	},
	twitter: secret.twitter,
	controller: {
		port: port + 1
	}
};
