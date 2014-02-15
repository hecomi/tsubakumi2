var secret = require('./settings.secret');

module.exports = {
	port: process.env.PORT || 23456,
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
		irMap : require('./ir-map'),
		test  : {
			checkIrNum : 999,  // テストする IR 番号
			isCheckIc  : false // 赤外線の学習のテストをするか
		}
	},
	WeMo: {
		// モニタのスイッチ
		switches : {
			monitor: {
				ip: '192.168.0.9',
				port: 49153
			}
		},
		// 玄関
		motions : {
			entrance: {
				ip: '192.168.0.14',
				port: 49154
			}
		}
	},
	hue: {
		id   : '001788fffe15ccd4',
		ip   : '192.168.0.8',
		user : secret.hue.user
	}
};
