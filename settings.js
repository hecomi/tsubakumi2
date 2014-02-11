module.exports = {
	iRemocon: {
		ip: '192.168.1.113',
		test: {
			checkIrNum : 999,  // テストする IR 番号
			isCheckIc  : false // 赤外線の学習のテストをするか
		}
	},
	WeMo: {
		Switch: {
			ip: '192.168.1.107'
		},
		Motion: {
			ip: '192.168.1.108'
		}
	}
};
