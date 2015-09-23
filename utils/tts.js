var settings = require('../settings');
var get = require('./get');

module.exports = (word, option, callback) => {
	if (typeof(option) === 'function') {
		callback = option;
		option = {
			returnSoon  : false,
			stopCurrent : false
		};
	}
	var url = '/tts/';
	if (option.returnSoon) {
		url += 'soon/';
	}
	if (option.stopCurrent) {
		url += 'stop/';
	}
	url += encodeURIComponent(word);
	get(url, callback);
};
