var _        = require('underscore');
var express  = require('express');
var app      = express();
var get      = require('../utils').get;
var settings = require('../settings');

// Rule
// --------------------------------------------------------------------------------
var wordMap   = require('../settings/word-map');
var rules       = {};
var recognizing = true;

// 認識開始 / 一時停止を登録
wordMap.push({
	word: '(音声)?認識開始(して)?',
	rule: {
		recogStartRule: true,
		func: function() {
			get('/restart');
			if (recognizing) {
				return '既に開始してますよ！';
			} else {
				recognizing = true;
				return '認識を開始します';
			}
		}
	}
});

wordMap.push({
	word: ['(認識)?(一時)?停止(して)?', '(ちょっと)?だまって(て)?'],
	rule: {
		func: function() {
			if (!recognizing) {
				return '現在停止中です';
			} else {
				recognizing = false;
				return '認識を一時停止します';
			}
		}
	}
});

// マップから登録
wordMap.forEach(function(speech) {
	if (!speech || !speech.word || !speech.rule) {
		throw new Error('speech-map.js contains invalid data');
	}
	var words = (speech.word instanceof Array) ? speech.word : [speech.word];
	words.forEach(function(word) {
		rules[word] = speech.rule;
	});
});

// Settings
// --------------------------------------------------------------------------------
app.enable('jsonp callback');
for (var key in settings) {
	app.set(key, settings[key]);
}

// ejs
app.set('view engine', 'ejs');
app.set('views', __dirname + '/../views');
app.use(express.static(__dirname + '/../bower_components'));
app.use(express.static(__dirname + '/../views/public'));

// Middlewares
// --------------------------------------------------------------------------------
app.use(require('express-domain-middleware'));
app.use(express.logger());
app.use(express.favicon());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(app.router);
app.use(require('./middlewares/errorHandler.js'));

// Routings
// --------------------------------------------------------------------------------
app.get('/status', function(req, res) {
	res.jsonp({
		recognizing: recognizing
	});
});

app.get('/controller', function(req, res) {
	var words = _.chain(rules).keys().map(function(word) {
		return word.replace(/\?/g, '').replace(
			/\(([^|)]+).*?\)/g, function() { return RegExp.$1; });
	});
	res.render('controller', {words : words});
});

app.get('/apis', function(req, res) {
	var words = _.chain(rules).keys().map(function(word) {
		return word.replace(/\?/g, '').replace(
			/\(([^|)]+).*?\)/g, function() { return RegExp.$1; });
	}).value();
	res.jsonp({ apis: words });
});

app.get('/apis/pebble', function(req, res) {
	var apis = [];
	_.each(rules, function(rule) {
		console.log(rule);
		if (rule.api && !(rule.api instanceof Array)) {
			apis.push(rule.api);
		}
	});
	res.jsonp({ apis: apis });
});

app.get('/:word', function(req, res) {
	var matched = false;
	_.each(rules, function(rule, key) {
		if ( matched || (!recognizing && !rule.recogStartRule) ) {
			return;
		}
		var regex = new RegExp(key);
		var word = decodeURIComponent(req.params.word);
		if ( word && word.match(regex) ) {
			matched = true;
			var reply = '';
			if (rule.reply) {
				console.log('  ==>', rule.reply);
				reply = rule.reply;
			}
			if (rule.api) {
				console.log('  ==>', rule.api);
				var apis = (rule.api instanceof Array) ? rule.api : [rule.api];
				apis.forEach(get);
			}
			if (rule.async) {
				if (rule.func)  {
					console.log('  ==> func (asnyc)');
					rule.func(req.params.word, res);
				} else {
					throw new Error('Rule map is something wrong');
				}
			} else {
				if (rule.func) {
					console.log('  ==> func');
					var word = rule.func(req.params.word);
					if (word) reply = word;
				}
				res.jsonp({ reply: reply });
			}
		}
	});
	if (!matched) {
		if (!recognizing) {
			res.jsonp({ error: 'recognition is stopping now' });
		} else {
			res.jsonp({ error: 'no much rule for \'' + req.params.word + '\'' });
		}
	}
});

// Start Server
// --------------------------------------------------------------------------------
app.listen(app.get('controller').port);
console.log('CONTROLLER PORT:', app.get('controller').port);

// Unexpected Errors
// --------------------------------------------------------------------------------
process.on('uncaughtException', function(err) {
	console.error('UNCAUGHT EXCEPTION:', err);
});
