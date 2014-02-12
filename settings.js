module.exports = {
	DB: {
		host        : 'localhost',
		port        : 27017,
		dbName      : 'tsubakumi',
		collections : {
			ir: 'ir'
		}
	},
	iRemocon: {
		ip: '192.168.1.113',
		test: {
			checkIrNum : 999,  // テストする IR 番号
			isCheckIc  : false // 赤外線の学習のテストをするか
		}
	},
	WeMo: {
		// モニタのスイッチ
		switches : {
			monitor: {
				ip: '192.168.1.107',
				port: 49153
			}
		},
		// 玄関
		motions : {
			entrance: {
				ip: '192.168.1.108',
				port: 49154
			}
		}
	}
};
