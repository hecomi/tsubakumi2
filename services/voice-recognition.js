var domain   = require('domain');
var wordMap  = require('../settings/word-map');
var utils    = require('../utils');
var query    = require('../utils').query;
var tts      = require('../utils').tts;
var Julius   = require('julius');
var grammar  = new Julius.Grammar();
var replying = false;

// 声で返答
var reply = word => {
	if (!word) {
		console.warn('%s is invalid to be speeched.', word);
		return;
	}
	word = (word instanceof Array) ? word : [word];
	var index = Math.floor(Math.random() * word.length);
	console.log('[返答]', word[index]);
	replying = true;
	tts(word[index], () => {
		replying = false;
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
wordMap.forEach(function(speech) {
	if (!speech || !speech.word || !speech.rule) {
		throw new Error('word-map.js contains invalid data');
	}
	var words = (speech.word instanceof Array) ? speech.word : [speech.word];
	words.forEach(grammar.add.bind(grammar));
});

// 音声認識開始
grammar.compile(function(err, result) {
	if (err) throw err;

	var julius = new Julius( grammar.getJconf() );
	julius.start();
	grammar.deleteFiles();

	// 応答を登録
	julius.on('result', function(str) {
		if (replying) { return; }
		console.log('[認識結果]', str);

		var d = domain.create();
		d.run(function() {
			query(str, function(result) {
				if (result && result.reply) {
					reply(result.reply);
				}
			});
		});
		d.on('error', function(e) {
			console.error(e.toString());
		});
	});
});

process.on('uncaughtException', function(err) {
	console.error('UNCAUGHT EXCEPTION:', err);
});
