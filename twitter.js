var _         = require('underscore');

var get       = require('./utilities').get;
var settings  = require('./settings.js');
var speechMap = require('./settings/speech-map.js');
var rules     = {};

var twitter   = require('twitter');
var bot       = new twitter(settings.twitter);

// Twitter で返答
var reply = function(word) {
	word = (word instanceof Array) ? word : [word];
	var index = Math.floor(Math.random() * word.length);
	bot.updateStatus(word[index], function(data) {
		// TODO: Error Check
	});
};

// Speech Map を便利な形に変換
speechMap.forEach(function(speech) {
	if (!speech || !speech.word || !speech.rule) {
		throw new Error('speech-map.js contains invalid data');
	}
	var words = (speech.word instanceof Array) ? speech.word : [speech.word];
	words.forEach(function(word) {
		rules[word] = speech.rule;
	});
});

// ストリームをチェック
bot.stream('user', function(stream) {
	stream.on('data', function(data) {
		if (!data || !data.text ||
			!data.text.match(settings.twitter.id)) { return; }

		console.log('[ツイート]', data.text);
		_.each(rules, function(rule, key) {
			var regex = new RegExp(key);
			if ( data.text.match(regex) ) {
				if (rule.reply) {
					console.log('  ==>', rule.reply);
					reply(rule.reply);
				}
				if (rule.func)  {
					console.log('  ==> func');
					var word = rule.func(data.text);
					if (word) reply(word);
				}
				if (rule.api) {
					console.log('  ==>', rule.api);
					var apis = (rule.api instanceof Array) ? rule.api : [rule.api];
					apis.forEach(get);
				}
			}
		});
	});
});

process.on('uncaughtException', function(err) {
	console.error('UNCAUGHT EXCEPTION:', err);
});
