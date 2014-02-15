TSUBAKUMI
=========

はじめに
--------
@hecomi 家のホームコントロールシステムです。赤外線リモコン、WeMO、hue などの各種ガジェットの機能を WebAPI 化し、そこから操作できる機器や動作の組み合わせのマクロを更に WebAPI 化しています。これにより、他のガジェット（PCやスマホ、Pebble など）から一通りの家電操作を可能とするシステムとなっています。
例えば、以下の様な URL を叩くと家電を操作することが出来ます。
* http://192.168.0.10:23456/projector/on
* http://192.168.0.10:23456/projector/hdmi/2
* http://192.168.0.10:23456/aircon/degree/20
* http://192.168.0.10:23456/ps3/left

環境
----
* Mac OS X 10.9.1
* Node.js 0.10.4

設定
----
```./setting.js``` に一通りの設定（機器の IP など）を記述しています。また、hue のユーザー ID の様に公開したくないものに関しては、```./settings.secret.js``` に記述し、```.gitignore``` で除外しています。

Device APIs
-----------
直接操作できる機器の WebAPI になります。iRemocon、WeMo Switch、WeMo Motion、hue に現在対応しています。

* **/device/iremocon/:api**
	* ```:api``` は ```list```、```au```、```is```、```ic```、```cc``` が使えます。
	* ```is``` では ```./ir-map.js``` で記述した名前でも呼び出すことが出来ます。
	* 使用例
		* http://192.168.0.10:23456/device/iremocon/list
		* http://192.168.0.10:23456/device/iremocon/is/10
		* http://192.168.0.10:23456/device/iremocon/is/light/on
	* また、```is``` は省略名でも呼び出すことが出来ます。
		* http://192.168.0.10:23456/10
		* http://192.168.0.10:23456/light/on

* **/device/wemo/:kind/:target/:api**
	* ```:kind``` には ```switch``` か ```motion``` を指定します。
	* ```:target``` は ```./search.js``` に記述した識別名を指定します。
	* ```:api``` は両者共通で ```state```、```switch``` に関しては ```on```、```off``` に対応しています。
	* 使用例
		* http://192.168.0.10:23456/device/wemo/switch/monitor/on
		* http://192.168.0.10:23456/device/wemo/motion/entrance/state

* **/device/hue/:api/:arg1/:arg2/:arg3**
	* ```:api``` は情報を取得する ```lights```、```fullState```、```registeredUsers```、```lightStatus``` と、状態をセットする ```on```、```off```、```rgb```、```hsl```、```xy```、```white```、```brightness```、```alert``` があります。
	* 状態セット系は、```:arg1``` に機器番号、```:arg2``` に状態を入れます。また、オプショナルの ```:arg3``` で遷移時間を指定できます。
	* 使用例
		* http://192.168.0.10:23456/device/hue/fullState
		* http://192.168.0.10:23456/device/hue/rgb/1/255,0,0
		* http://192.168.0.10:23456/device/hue/brightness/255/10
		* http://192.168.0.10:23456/device/hue/alert/3
	* TODO
		* 機器番号は機器名でも可能にする

Macro APIs
----------
**Device API** を組み合わせたり、ユーザフレンドリーにリネームした API になります。
* 作成中...

IR MAP
------
機器のほとんどは IR で操作します。そのため ```./ir-map.js``` に、iRemocon に学習させる IR の番号および、その機能を定義しています。

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

これらは ```tool/iremocon/learn.js``` で学習することが出来ます。
そして Device/iRemocon API で ```/device/iremocon/is/1``` や、```/device/iremocon/is/projector/on``` といった形で呼び出すことが出来ます。

TOOLs
-----
各種ガジェットの設定に必要なスクリプトが ```tool``` 以下に入っています。

* ```/iremocon/search.js```
	* iRemocon の発見に使います。au コマンドを利用しています。
	* 使用例: ```$ node ./tool/iremocon/search.js '192.168.1.'```

* ```/iremocon/learn.js```
	* ```./ir-map.js``` に記述された情報を元に赤外線リモコンの対話的学習を行います。
	* 使用例: ```$ node ./tool/iremocon/learn.js -f 50 -t 60```

* ```/iremocon/stop_learning.js```
	* 学習中止の cc コマンドを発行します。

* ```/wemo/search.js```
	* WeMo の発見に使います。SSDP で探します。
	* 使用例: ```$ node ./tool/wemo/search.js```

* ```/hue/search.js```
	* hue の発見に使います。
	* 使用例: ```$ node ./tool/hue/search.js```

* ```/hue/register.js```
	* hue へユーザー ID の発行を依頼します。
	* 使用例: ```$ node ./tool/hue/search.js```

MEMO
----
エアコンの赤外線の形式は特殊なので、現状の IR MAP だと上手く行っていないかも...

LICENSE
-------
* NYSL License
