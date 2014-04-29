var request = require('request');
var printf  = require('printf');

module.exports = [
	{
		word: [
			'再起動',
		],
		rule: {
			reply: '再起動します',
			api: '/restart'
		}
	},
	{
		word: '(明日の|今日の)?天気(教えて)?',
		rule: {
			async: true,
			func: function(str, res) {
				console.log(res);
				var url = 'http://weather.livedoor.com/forecast/webservice/json/v1?city=130010';
				request.get({url: url, json: true}, function(err, response, json) {
					if (err) throw err;
					var time = '今日', index = 0;
					if ( str.indexOf('明日') !== -1 ) {
						time  = '明日';
						index = 1;
					}
					var forecast = json.forecasts[index];
					var weather = forecast.telop;
					var min = forecast.temperature.min ?
						printf('、最低気温は%s度', forecast.temperature.min.celsius) : '';
					var max     = forecast.temperature.max ?
						printf('、最低気温は%s度', forecast.temperature.max.celsius) : '';
					var reply = printf('%sの天気は%s%s%sです。', time, weather, min, max);
					res.jsonp({ reply: reply });
				});
			}
		}
	},
	{
		word: 'おはようございます',
		rule: {
			reply: 'おはようございます',
			api: '/light/on'
		}
	},
	{
		word: 'おやすみなさい',
		rule: {
			api: [
				'/light/off',
				'/all/monitor/off'
			]
		}
	},
	{
		word: '電気をつけて',
		rule: {
			reply: '電気をつけます',
			api: '/light/on'
		}
	},
	{
		word: '電気を明るく',
		rule: {
			reply: '電気を明るくします',
			api: '/light/high'
		}
	},
	{
		word: '電気を?ちょっと明るく(して)?',
		rule: {
			reply: '電気をちょっと明るくします',
			api: '/light/medium-high'
		}
	},
	{
		word: '電気を?ちょっと暗く(して)?',
		rule: {
			reply: '電気をちょっと暗くします',
			api: '/light/medium-low'
		}
	},
	{
		word: '電気を?暗く(して)?',
		rule: {
			reply: '電気を暗くします',
			api: '/light/low'
		}
	},
	{
		word: '電気を?こだま',
		rule: {
			reply: '電気をこだまにします',
			api: '/light/midget'
		}
	},
	{
		word: '電気を?(消して|オフ)',
		rule: {
			reply: '電気を消します',
			api: '/light/off'
		}
	},
	{
		word: 'マックのモニタを(つけて|オン)',
		rule: {
			reply: 'マックのモニタをつけます',
			api: '/mac/monitor/on'
		}
	},
	{
		word: 'マックのモニタを(消して|オフ)',
		rule: {
			reply: 'マックのモニタを消します',
			api: '/mac/monitor/off'
		}
	},
	{
		word: 'ウインドウズのモニタを(つけて|オン)',
		rule: {
			reply: 'ウインドウズのモニタをつけます',
			api: '/windows/monitor/on'
		}
	},
	{
		word: 'ウインドウズのモニタを(消して|オフ)',
		rule: {
			reply: 'ウインドウズのモニタを消します',
			api: '/windows/monitor/off'
		}
	},
	{
		word: '(すべての|全部)モニタを(消して|オフ)',
		rule: {
			reply: 'モニタを消します',
			api: '/all/monitor/off'
		}
	},
	{
		word: '(すべての|全部)モニタを(つけて|オン)',
		rule: {
			reply: 'モニタをつけます',
			api: '/all/monitor/on'
		}
	},
	{
		word: 'プロジェクタを?(つけて|オン)',
		rule: {
			reply: 'プロジェクタをつけます',
			api: '/projector/on'
		}
	},
	{
		word: 'プロジェクタを?(消して|オフ)',
		rule: {
			reply: 'プロジェクタを消します',
			api: '/projector/shutdown'
		}
	},
	{
		word: 'プロジェクタ(左|レフト)',
		rule: {
			reply: '左',
			api: '/projector/left'
		}
	},
	{
		word: 'プロジェクタ(上|アップ) ',
		rule: {
			reply: '上',
			api: '/projector/up'
		}
	},
	{
		word: 'プロジェクタ(右|ライト)',
		rule: {
			reply: '右',
			api: '/projector/right'
		}
	},
	{
		word: 'プロジェクタ(下|ダウン)',
		rule: {
			reply: '下',
			api: '/projector/bottom'
		}
	},
	{
		word: 'プロジェクタ決定',
		rule: {
			reply: '決定',
			api: '/projector/enter'
		}
	},
	{
		word: 'プロジェクタクリック',
		rule: {
			reply: 'クリック',
			api: '/projector/click'
		}
	},
	{
		word: 'プロジェクタイグジット',
		rule: {
			reply: 'イグジット',
			api: '/projector/exit'
		}
	},
	{
		word: 'プロジェクタメニュー',
		rule: {
			reply: 'メニューを開きます',
			api: '/projector/menu'
		}
	},
	{
		word: 'プロジェクタミュート',
		rule: {
			reply: 'ミュート',
			api: '/projector/mute'
		}
	},
	{
		word: 'プロジェクタの?ソース(を表示)?',
		rule: {
			reply: 'ソース',
			api: '/projector/source'
		}
	},
	{
		word: 'プロジェクタで?エッチディーエムアイ(を表示)?',
		rule: {
			reply: 'エッチディーエムアイを表示します',
			api: '/projector/input/hdmi'
		}
	},
	{
		word: 'プロジェクタページアップ',
		rule: {
			reply: 'ページアップ',
			api: '/projector/page up'
		}
	},
	{
		word: 'プロジェクタページダウン',
		rule: {
			reply: 'ページダウン',
			api: '/projector/page down'
		}
	},
	{
		word: 'プロジェクタボリュームアップ',
		rule: {
			reply: 'ボリュームアップ',
			api: '/projector/volume up'
		}
	},
	{
		word: 'プロジェクタボリュームダウン',
		rule: {
			reply: 'ボリュームダウン',
			api: '/projector/volume down'
		}
	},
	{
		word: 'アップルティービーレフト',
		rule: {
			reply: 'レフト',
			api: '/appletv/left'
		}
	},
	{
		word: 'アップルティービーアップ',
		rule: {
			reply: 'アップ',
			api: '/appletv/up'
		}
	},
	{
		word: 'アップルティービーライト',
		rule: {
			reply: 'ライト',
			api: '/appletv/right'
		}
	},
	{
		word: 'アップルティービーダウン',
		rule: {
			reply: 'ダウン',
			api: '/appletv/down'
		}
	},
	{
		word: 'アップルティービーエンター',
		rule: {
			reply: 'エンター',
			api: '/appletv/enter'
		}
	},
	{
		word: 'アップルティービーメニュー',
		rule: {
			reply: 'メニュー',
			api: '/appletv/menu'
		}
	},
	{
		word: 'アップルティービー(プレイ|ポーズ)',
		rule: {
			reply: 'プレイポーズ',
			api: '/appletv/play/pause'
		}
	},
	{
		word: 'プレステ(スリー)?ホーム',
		rule: {
			reply: 'ホーム',
			api: '/ps3/home'
		}
	},
	{
		word: 'プレステ(スリー)?スキャン',
		rule: {
			reply: 'スキャン',
			api: '/ps3/scan'
		}
	},
	{
		word: 'プレステ(スリー)?トップメニュー',
		rule: {
			reply: 'トップメニュー',
			api: '/ps3/top menu'
		}
	},
	{
		word: 'プレステ(スリー)?(プレビオス|前)',
		rule: {
			reply: '前',
			api: '/ps3/prev'
		}
	},
	{
		word: 'プレステ(スリー)?(プレイ|再生)',
		rule: {
			reply: '再生',
			api: '/ps3/play'
		}
	},
	{
		word: 'プレステ(スリー)?ポーズ',
		rule: {
			reply: 'ポーズ',
			api: '/ps3/pause'
		}
	},
	{
		word: 'プレステ(スリー)?(ネクスト|次)',
		rule: {
			reply: '次',
			api: '/ps3/next'
		}
	},
	{
		word: 'プレステ(スリー)?サンカク',
		rule: {
			reply: 'サンカク',
			api: '/ps3/△'
		}
	},
	{
		word: 'プレステ(スリー)?マル',
		rule: {
			reply: 'マル',
			api: '/ps3/○'
		}
	},
	{
		word: 'プレステ(スリー)?シカク',
		rule: {
			reply: 'シカク',
			api: '/ps3/□'
		}
	},
	{
		word: 'プレステ(スリー)?バツ',
		rule: {
			reply: 'バツ',
			api: '/ps3/×'
		}
	},
	{
		word: 'プレステ(スリー)?(左|レフト)',
		rule: {
			reply: '左',
			api: '/ps3/left'
		}
	},
	{
		word: 'プレステ(スリー)?(上|アップ)',
		rule: {
			reply: '上',
			api: '/ps3/up'
		}
	},
	{
		word: 'プレステ(スリー)?(右|ライト)',
		rule: {
			reply: '右',
			api: '/ps3/right'
		}
	},
	{
		word: 'プレステ(スリー)?(下|ダウン)',
		rule: {
			reply: '下',
			api: '/ps3/down'
		}
	},
	{
		word: 'プレステ(スリー)?(決定|エンター)',
		rule: {
			reply: '決定',
			api: '/ps3/enter'
		}
	},
	{
		word: 'プレステ(スリー)?エルイチ',
		rule: {
			reply: 'エルイチ',
			api: '/ps3/L1'
		}
	},
	{
		word: 'プレステ(スリー)?エルニ',
		rule: {
			reply: 'エルニ',
			api: '/ps3/L2'
		}
	},
	{
		word: 'プレステ(スリー)?エルサン',
		rule: {
			reply: 'エルサン',
			api: '/ps3/L3'
		}
	},
	{
		word: 'プレステ(スリー)?アールイチ',
		rule: {
			reply: 'アールイチ',
			api: '/ps3/R1'
		}
	},
	{
		word: 'プレステ(スリー)?アールニ',
		rule: {
			reply: 'アールニ',
			api: '/ps3/R2'
		}
	},
	{
		word: 'プレステ(スリー)?アールサン',
		rule: {
			reply: 'アールサン',
			api: '/ps3/R3'
		}
	},
	{
		word: 'プレステ(スリー)?セレクト',
		rule: {
			reply: 'セレクト',
			api: '/ps3/select'
		}
	},
	{
		word: 'プレステ(スリー)?スタート',
		rule: {
			reply: 'スタート',
			api: '/ps3/start'
		}
	},
	{
		word: 'プレステ(スリー)?ディスプレイ',
		rule: {
			reply: 'ディスプレイ',
			api: '/ps3/display'
		}
	},
	{
		word: 'プレステで?トルネを起動',
		rule: {
			reply: 'トルネを起動します',
			api: '/ps3/torne'
		}
	},
	{
		word: 'エアコン(つけて|オン)',
		rule: {
			reply: 'エアコンつけます',
			api: '/aircon/on'
		}
	},
	{
		word: 'エアコン(消して|オフ)',
		rule: {
			reply: 'エアコン消します',
			api: '/aircon/off'
		}
	},
	{
		word: 'エアコン(簡単|イージー)タイマー',
		rule: {
			reply: 'エアコンの簡単タイマーを設定します',
			api: '/aircon/easy timer'
		}
	},
	{
		word: 'エアコン自動',
		rule: {
			reply: 'エアコンのモードを自動にします',
			api: '/aircon/auto'
		}
	},
	{
		word: 'エアコンドライ',
		rule: {
			reply: 'エアコンのモードをドライにします',
			api: '/aircon/dry'
		}
	},
	{
		word: 'エアコン冷房',
		rule: {
			reply: '冷房にします',
			api: '/aircon/cool'
		}
	},
	{
		word: 'エアコン暖房',
		rule: {
			reply: '暖房にします',
			api: '/aircon/warm'
		}
	},
	{
		word: 'エアコン送風',
		rule: {
			reply: '送風にします',
			api: '/aircon/wind'
		}
	},
	{
		word: 'エアコン風量１',
		rule: {
			reply: 'エアコン風量１',
			api: '/aircon/power 1'
		}
	},
	{
		word: 'エアコン風量２',
		rule: {
			reply: 'エアコン風量２',
			api: '/aircon/power 2'
		}
	},
	{
		word: 'エアコン風量３',
		rule: {
			reply: 'エアコン風量３',
			api: '/aircon/power 3'
		}
	},
	{
		word: 'エアコン風量４',
		rule: {
			reply: 'エアコン風量４',
			api: '/aircon/power 4'
		}
	},
	{
		word: 'エアコン風量５',
		rule: {
			reply: 'エアコン風量５',
			api: '/aircon/power 5'
		}
	},
	{
		word: 'エアコン風量自動',
		rule: {
			reply: 'エアコンの風量を自動にします',
			api: '/aircon/power auto'
		}
	},
	{
		word: 'エアコン風量静か',
		rule: {
			reply: 'エアコンの風量を静かにします',
			api: '/aircon/power calm'
		}
	},
	{
		word: 'エアコン風向き固定',
		rule: {
			reply: 'エアコンの風向きを固定にします',
			api: '/aircon/direction fix'
		}
	},
	{
		word: 'エアコン風向き自動',
		rule: {
			reply: 'エアコンの風向きを自動にします',
			api: '/aircon/direction move'
		}
	},
	{
		word: 'エアコン14度',
		rule: {
			reply: 'エアコン14度',
			api: '/aircon/degree 14'
		}
	},
	{
		word: 'エアコン15度',
		rule: {
			reply: 'エアコン15度',
			api: '/aircon/degree 15'
		}
	},
	{
		word: 'エアコン16度',
		rule: {
			reply: 'エアコン16度',
			api: '/aircon/degree 16'
		}
	},
	{
		word: 'エアコン17度',
		rule: {
			reply: 'エアコン17度',
			api: '/aircon/degree 17'
		}
	},
	{
		word: 'エアコン18度',
		rule: {
			reply: 'エアコン18度',
			api: '/aircon/degree 18'
		}
	},
	{
		word: 'エアコン19度',
		rule: {
			reply: 'エアコン19度',
			api: '/aircon/degree 19'
		}
	},
	{
		word: 'エアコン20度',
		rule: {
			reply: 'エアコン20度',
			api: '/aircon/degree 20'
		}
	},
	{
		word: 'エアコン21度',
		rule: {
			reply: 'エアコン21度',
			api: '/aircon/degree 21'
		}
	},
	{
		word: 'エアコン22度',
		rule: {
			reply: 'エアコン22度',
			api: '/aircon/degree 22'
		}
	},
	{
		word: 'エアコン23度',
		rule: {
			reply: 'エアコン23度',
			api: '/aircon/degree 23'
		}
	},
	{
		word: 'エアコン24度',
		rule: {
			reply: 'エアコン24度',
			api: '/aircon/degree 24'
		}
	},
	{
		word: 'エアコン25度',
		rule: {
			reply: 'エアコン25度',
			api: '/aircon/degree 25'
		}
	},
	{
		word: 'エアコン26度',
		rule: {
			reply: 'エアコン26度',
			api: '/aircon/degree 26'
		}
	},
	{
		word: 'エアコン27度',
		rule: {
			reply: 'エアコン27度',
			api: '/aircon/degree 27'
		}
	},
	{
		word: 'エアコン28度',
		rule: {
			reply: 'エアコン28度',
			api: '/aircon/degree 28'
		}
	},
	{
		word: 'エアコン29度',
		rule: {
			reply: 'エアコン29度',
			api: '/aircon/degree 29'
		}
	},
	{
		word: 'エアコン30度',
		rule: {
			reply: 'エアコン30度',
			api: '/aircon/degree 30'
		}
	},
	{
		word: 'プロジェクタエッチディーエムアイ前',
		rule: {
			reply: 'プロジェクタエッチディーエムアイ前',
			api: '/projector/hdmi prev'
		}
	},
	{
		word: 'プロジェクタエッチディーエムアイ次',
		rule: {
			reply: 'プロジェクタエッチディーエムアイ次',
			api: '/projector/hdmi next'
		}
	},
	{
		word: 'プロジェクタエッチディーエムアイ1',
		rule: {
			reply: 'プロジェクタエッチディーエムアイ1',
			api: '/projector/hdmi 1'
		}
	},
	{
		word: 'プロジェクタエッチディーエムアイ2',
		rule: {
			reply: 'プロジェクタエッチディーエムアイ2',
			api: '/projector/hdmi 2'
		}
	},
	{
		word: 'プロジェクタエッチディーエムアイ3',
		rule: {
			reply: 'プロジェクタエッチディーエムアイ3',
			api: '/projector/hdmi 3'
		}
	},
	{
		word: 'プロジェクタエッチディーエムアイ4',
		rule: {
			reply: 'プロジェクタエッチディーエムアイ4',
			api: '/projector/hdmi 4'
		}
	},
];
