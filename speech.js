var speechMap   = require('./settings/speech-map');
var get         = require('./utilities').get;
var _           = require('underscore');

var Julius      = require('julius');
var grammar     = new Julius.Grammar();
var rules       = {};
var speeching   = false;
var recognizing = true;

var OpenJTalk   = require('openjtalk');
var openjtalk   = new OpenJTalk();

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

// 声で返答
var reply = function(word) {
	if (!word) {
		console.warn('%s is invalid to be speeched.', word);
		return;
	}
	word = (word instanceof Array) ? word : [word];
	speeching = true;
	var index = Math.floor(Math.random() * word.length);
	openjtalk.talk(word[index], function() {
		setTimeout(function() {
			speeching = false;
		}, 1000);
	});
};

// 認識開始 / 一時停止を登録
speechMap.push({
	word: '認識開始(して)?',
	rule: {
		recogStartRule: true,
		func: function() {
			get('/restart');
			if (recognizing) {
				openjtalk.talk('既に開始してますよ！');
			} else {
				openjtalk.talk('認識を開始します');
				recognizing = true;
			}
		}
	}
});
speechMap.push({
	word: ['(認識)?一時停止(して)?', '(ちょっと)だまってて?'],
	rule: {
		func: function() {
			if (!recognizing) {
				openjtalk.talk('現在停止中です');
			} else {
				openjtalk.talk('認識を一時停止します');
				recognizing = false;
			}
		}
	}
});

// 音声認識の文法と応答のルールを登録
speechMap.forEach(function(speech) {
	if (!speech || !speech.word || !speech.rule) {
		throw new Error('speech-map.js contains invalid data');
	}

	var words = (speech.word instanceof Array) ? speech.word : [speech.word];
	words.forEach(function(word) {
		grammar.add(word);
		rules[word] = speech.rule;
	});
});

// 音声認識開始
grammar.compile(function(err, result) {
	if (err) throw err;

	var julius = new Julius( grammar.getJconf() );
	grammar.deleteFiles();
	julius.start();

	// 応答を登録
	julius.on('result', function(str) {
		if (speeching) { return; }
		console.log('[認識結果]', str);

		_.each(rules, function(rule, key) {
			var regex = new RegExp(key);
			if ( str.match(regex) ) {
				if (!recognizing && !rule.recogStartRule) {
					return;
				}
				if (rule.reply) {
					console.log('  ==>', rule.reply);
					reply(rule.reply);
				}
				if (rule.func)  {
					console.log('  ==> func');
					var word = rule.func(str);
					if (word) reply(word);
				}
				if (rule.api) {
					console.log('  ==>', rule.api);
					var apis = (rule.api instanceof Array) ? rule.api : [rule.api];
					apis.forEach(api);
				}
			}
		});
	});
});

process.on('uncaughtException', function(err) {
	console.error('UNCAUGHT EXCEPTION:', err);
});
