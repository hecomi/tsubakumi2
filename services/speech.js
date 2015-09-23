var domain    = require('domain');
var wordMap   = require('../settings/word-map');
var query     = require('../utils').query;

var Julius    = require('julius');
var grammar   = new Julius.Grammar();
var replying  = false;

var OpenJTalk = require('openjtalk');
var openjtalk = new OpenJTalk();

// 声で返答
var reply = word => {
	if (!word) {
		console.warn('%s is invalid to be speeched.', word);
		return;
	}
	word = (word instanceof Array) ? word : [word];
	replying = true;
	var index = Math.floor(Math.random() * word.length);
	console.log('[返答]', word[index]);
	openjtalk.talk(word[index], () => {
		setTimeout(() => {
			replying = false;
		}, 1000);
	});
};

// ゴミワード
var gomi = 'あいうえお';
for (var i = 0; i < gomi.length; ++i) {
	grammar.add(gomi[i]);
	for (var j = 0; j < gomi.length; ++j) {
		grammar.add(gomi[i] + gomi[j]);
		for (var k = 0; k < gomi.length; ++k) {
			grammar.add(gomi[i] + gomi[j] + gomi[k]);
		}
	}
}

// 認識開始 / 一時停止を登録
wordMap.push({
	word: '音声認識開始(して)?',
	rule: { /* dummy */ }
});
wordMap.push({
	word: ['(音声認識)?一時停止', '(ちょっと)?だまってて'],
	rule: { /* dummy */ }
});

// 音声認識の文法を登録
wordMap.forEach(speech => {
	if (!speech || !speech.word || !speech.rule) {
		throw new Error('word-map.js contains invalid data');
	}
	var words = (speech.word instanceof Array) ? speech.word : [speech.word];
	words.forEach(grammar.add.bind(grammar));
});

// 音声認識開始
grammar.compile((err, result) => {
	if (err) throw err;

	var julius = new Julius( grammar.getJconf() );
	julius.start();
	grammar.deleteFiles();

	// 応答を登録
	julius.on('result', str => {
		if (replying) { return; }
		console.log('[認識結果]', str);

		var d = domain.create();
		d.run(() => {
			query(str, result => {
				if (result && result.reply) {
					reply(result.reply);
				}
			});
		});
		d.on('error', e => {
			console.error(e.toString());
		});
	});
});

process.on('uncaughtException', err => {
	console.error('UNCAUGHT EXCEPTION:', err);
});
