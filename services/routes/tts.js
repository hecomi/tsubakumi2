var OpenJTalk = require('openjtalk');
var openjtalk = new OpenJTalk();
var exec = require('child_process').exec;

var InvalidMacroError = msg => {
	var e = new Error(msg);
	e.name = 'InvalidTTSError';
	return e;
};

var killAfplay = () => {
	exec('killall afplay');
};

var routes = (app, opt) => {
	return (req, res) => {
		var opt1 = req.params.opt1 || opt;
		var opt2 = req.params.opt2;
		var returnSoon  = (opt1 === 'soon') || (opt2 === 'soon');
		var stopCurrent = (opt1 === 'stop') || (opt2 === 'stop');

		var word = req.params[0];
		var ret = {
			word: word,
			returnSoon: returnSoon
		};

		if (stopCurrent) {
			killAfplay();
		}

		if (word) {
			openjtalk.talk(word, (err, process) => {
				if (!returnSoon) res.jsonp({
					word: word,
					returnSoon: returnSoon,
					stopCurrent: stopCurrent
				});
			});
		}

		if (returnSoon || word === undefined) {
			res.jsonp({
				word: word || '',
				returnSoon: returnSoon,
				stopCurrent: stopCurrent
			});
		}
	};
};

module.exports = app => {
	app.get('/tts/stop', routes(app, 'stop'));
	app.get('/tts/:opt1/:opt2/*', routes(app));
	app.get('/tts/:opt1/*', routes(app));
	app.get('/tts/*', routes(app));
};
