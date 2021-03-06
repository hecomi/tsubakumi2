TSUBAKUMI 2
===========

はじめに
--------
@hecomi 家の**ホームコントロールシステム**の２世代目です。iRemocon、WeMo、hue、Netatmo などの各種ガジェットの機能を WebAPI 化し、そこから操作できる機器や動作の組み合わせを更に WebAPI 化しています。これにより、他のガジェット（PCやスマホ、Pebble など）から一通りの家電操作を可能とするシステムとなっています。
例えば、以下の様な URL を叩くと家電を操作することが出来ます。

* http://192.168.0.10:23456/projector/on
* http://192.168.0.10:23456/projector/hdmi/2
* http://192.168.0.10:23456/aircon/degree/20
* http://192.168.0.10:23456/ps3/left

また、これらの API を利用して、人の動きを検知すると自動でつく照明や、音声認識による家電操作をしています。

環境
----
* Mac OS X 10.9.1
* Node.js 0.10.4

設定
----
`./setting.js` に一通りの設定（機器の IP など）を記述しています。また、hue のユーザー ID の様に公開したくないものに関しては、`./settings.secret.js` に記述し、`.gitignore` で除外しています。

Device API
----------
直接操作できる機器の WebAPI になります。iRemocon、WeMo Switch、WeMo Motion、hue に現在対応しています。

* **/device/iremocon/:api**
	* `:api` は `list`、`au`、`is`、`ic`、`cc` が使えます。
	* `is` では `./settings/ir-map.js` で記述した名前でも呼び出すことが出来ます。
	* 使用例
		* http://192.168.0.10:23456/device/iremocon/list
		* http://192.168.0.10:23456/device/iremocon/is/10
		* http://192.168.0.10:23456/device/iremocon/is/light/on
	* また、`is` は省略名でも呼び出すことが出来ます。
		* http://192.168.0.10:23456/10
		* http://192.168.0.10:23456/light/on

* **/device/wemo/:kind/:target/:api**
	* `:kind` には `switch` か `motion` を指定します。
	* `:target` は `./search.js` に記述した識別名を指定します。
	* `:api` は両者共通で `state`、`switch` に関しては `on`、`off` に対応しています。
	* 使用例
		* http://192.168.0.10:23456/device/wemo/switch/monitor/on
		* http://192.168.0.10:23456/device/wemo/motion/entrance/state

* **/device/hue/:api/:arg1/:arg2/:arg3**
	* `:api` は情報を取得する `lights`、`fullState`、`registeredUsers`、`lightStatus` と、状態をセットする `on`、`off`、`rgb`、`hsl`、`xy`、`white`、`brightness`、`alert` があります。
	* 状態セット系は、`:arg1` に機器番号、`:arg2` に状態を入れます。また、オプショナルの `:arg3` で遷移時間を指定できます。
	* 使用例
		* http://192.168.0.10:23456/device/hue/fullState
		* http://192.168.0.10:23456/device/hue/rgb/1/255,0,0
		* http://192.168.0.10:23456/device/hue/brightness/255/10
		* http://192.168.0.10:23456/device/hue/alert/3
	* TODO
		* 機器番号は機器名でも可能にする

* **/device/netatmo/:api**
	* `:api` は室内情報の `room` と、室外情報の `outside` を指定します。
	* 使用例
		* http://192.168.0.10:23456/netatmo/room
		* http://192.168.0.10:23456/netatmo/outside

IR MAP
------
機器のほとんどは IR で操作します。そのため `./settings/ir-map.js` に、iRemocon に学習させる IR の番号および、その機能を定義しています。

```javascript
module.exports = {
	1  : ['light high', 'light on'],
	2  : 'light medium-high',
	3  : 'light medium-low',
	4  : 'light low',
	5  : 'light midget',
	6  : 'light off',
	7  : 'monitor off',
	8  : 'monitor on',
	9  : ['projector on', 'projector off'],
	...
};
```

これらは `tool/iremocon/learn.js` で学習することが出来ます。
そして Device/iRemocon API で `/device/iremocon/is/1` や、`/device/iremocon/is/projector/on` といった形で呼び出すことが出来ます。

Alias API
---------
**Device API** を単純に組み合わせたり、ユーザフレンドリーにリネームした API です。
`./settings/alias-map.js` に記載した通りにルーティングを行います。

```javascript
module.exports = {
	...
	'/entrance/light/on'  : '/device/hue/on/1',
	'/kitchen/light/on'   : ['/device/hue/on/2', '/device/hue/on/3'],
	'/room/light/on'      : '/light/on',
	'/all/light/on'       : ['/entrance/light/on', '/kitchen/light/on', '/room/light/on'],
	...
};
```

ここでは、`/device/hue/on/1` を `/entrance/light/on` という名前に書き換えたり、これらを組み合わせて同時に実行する `/all/light/on` などの API を定義しています。

* 使用例
	* http://192.168.0.10:23456/entrance/light/on
	* http://192.168.0.10:23456/all/light/on

Macro API
---------
**Device API** を複雑に組み合わせた API になります。
条件分岐などが発生する単純なリダイレクトでは制御できない内容を取り扱う API を定義しています。`./settings/macro-map.js` に一連のマクロを定義しており、`./settings/macro-map.js` に定義されています。
例えば下記例では、1 秒おきに二度続けて同じ IR 信号を発信する例になります。

```javascript
module.exports = function(app) {
	return {
		...
		'projector/shutdown': function(req, res) {
			_(2).times(function(n) {
				setTimeout(function() {
					var req = request.get(app.get('address') + '/projector/off');
					if (n === 1) req.pipe(res);
				}, 1000 * n);
			});
		}
		...
	};
};
```

Word Recognition API
--------------------
自然言語に対する処理と応答を行います。

* **http://192.168.0.4:23457/:word
与えられた自然言語に対する処理を行います。ルールは、`./settings/word-map.js` にて定義しています。

```javascript
module.exports = [
	{
		word: [ 'ワード1', 'ワード2' ],
		rule: {
			reply: 'ほげほげを実行します', // 応答で喋る言葉
			api: '/hogehoge' // 実行する API
		},
	},
	{
		word: '(明日の|今日の)?天気(教えて)?',
		rule: {
			func: function(str) {
				// return で返した言葉を喋る
				return str + 'だって？、ググれカス！';
			}
		}
	},
	...
];
```

* **http://192.168.0.4:23457/status
「認識停止」や「認識開始」で、内部の認識するか否かフラグを設定することが出来ます。`/status` ではこういった現在の状態について問い合わせることができます。


Voice Recognition
-----------------
Julius を利用したルールベースの音声認識を利用して操作を行います。
認識する言葉は *Word Recognition API* に依存します。
処理は `./speech.js` が行い、音声認識結果に対する応答は、OpenJTalk によって音声合成された声で返ってきます。


Twitter
-------
Twitter からの操作を `./twitter.js` で行います。
当該アカウントがフォローしているユーザがコマンド（自然言語）を mention すると、それを実行しリプライで返信します。
動作は *Word Recognition API* に依存します。


Gmail
-----
Gmail での着信を `./mail.js` で行います。
コマンド（自然言語）を記述したタイトルを見て、それを実行します。


IFTTT
-----
IFTTT のアクションを Gamil でのメール送信とすれば、上述の Gmail 連携機能で IFTTT のトリガと結びつけることが出来ます。例えばスマホの位置に連動して電気の ON/OFF などが可能です。


TOOLs
-----
各種ガジェットの設定に必要なスクリプトが `tool` 以下に入っています。

* **/iremocon/search.js**
	* iRemocon の発見に使います。au コマンドを利用しています。
	* 使用例: `$ node ./tool/iremocon/search.js '192.168.1.'`

* **/iremocon/learn.js**
	* `./settings/ir-map.js` に記述された情報を元に赤外線リモコンの対話的学習を行います。
	* 使用例: `$ node ./tool/iremocon/learn.js -f 50 -t 60`

* **/wemo/search.js**
	* WeMo の発見に使います。SSDP で探します。
	* 使用例: `$ node ./tool/wemo/search.js`

* **/hue/search.js**
	* hue の発見に使います。
	* 使用例: `$ node ./tool/hue/search.js`

* **/hue/register.js**
	* hue へユーザー ID の発行を依頼します。
	* 使用例: `$ node ./tool/hue/search.js`

TODO
----
* エアコンの赤外線の形式は特殊なので、現状の IR MAP だと上手く行っていないかもなので調べる
* OpenJTalk は API 化する

LICENSE
-------
* NYSL License
