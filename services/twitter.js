var _          = require('underscore');
var date_utils = require('date-utils');
var printf     = require('printf');

var get        = require('../utils').get;
var settings   = require('../settings');
var speechMap  = require('../settings/word-map');
var rules      = {};

var twitter    = require('twitter');
var bot        = new twitter(settings.twitter);
var friends    = [];

// Twitter で返答
var reply = function(id, word) {
	word = (word instanceof Array) ? word : [word];
	var index = Math.floor(Math.random() * word.length);
	var msg = printf('@%s %s [%s]', id, word[index], new Date().toFormat('YYYY/MM/DD HH24:MI:SS'));
	bot.updateStatus(msg, function(data) {
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
		// フレンドリストの格納
		if (data && data.friends) {
			friends = data.friends;
			return;
		}

		// ツイートのデータか（fav や friends list でないか）
		if (!data || !data.text ||
			!data.text.match(settings.twitter.id)) { return; }

		// フレンドからのツイートか
		if (!_.contains(friends, data.user.id)) {
			console.error('フォローしていないユーザ @%s からツイートが有りました', data.user.screen_name);
			return;
		}

		// 自分のつぶやきでないか（相手のつぶやきを利用する際のループ回避）
		var id = data.user.screen_name;
		if (id === settings.twitter.id) { return; }

		console.log('[ツイート] %s (by %s)', data.text, id);

		_.each(rules, function(rule, key) {
			var regex = new RegExp(key);
			if ( data.text.match(regex) ) {
				if (rule.reply) {
					console.log('  ==>', rule.reply);
					reply(id, rule.reply);
				}
				if (rule.func)  {
					console.log('  ==> func');
					var word = rule.func(data.text);
					if (word) reply(id, word);
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
