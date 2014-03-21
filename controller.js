var _        = require('underscore');
var express  = require('express');
var app      = express();
var get      = require('./utilities').get;
var settings = require('./settings');

// Rule
// --------------------------------------------------------------------------------
var wordMap   = require('./settings/word-map');
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
app.set('views', __dirname + '/views');

// Middlewares
// --------------------------------------------------------------------------------
app.use(require('express-domain-middleware'));
app.use(express.logger());
app.use(express.favicon());
app.use(express.bodyParser());
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
	res.render('controller', rules);
});

app.get('/:word', function(req, res) {
	var matched = false;
	_.each(rules, function(rule, key) {
		if ( matched || (!recognizing && !rule.recogStartRule) ) {
			return;
		}
		var regex = new RegExp(key);
		if ( req.params.word.match(regex) ) {
			matched = true;
			var reply = '';
			if (rule.reply) {
				console.log('  ==>', rule.reply);
				reply = rule.reply;
			}
			if (rule.func)  {
				console.log('  ==> func');
				var word = rule.func(req.params.word);
				if (word) reply = word;
			}
			if (rule.api) {
				console.log('  ==>', rule.api);
				var apis = (rule.api instanceof Array) ? rule.api : [rule.api];
				apis.forEach(get);
			}
			res.jsonp({ reply: reply });
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
