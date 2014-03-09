var request = require('request');

module.exports = function(app) {
	return {
		device     : require('./device')(app),
		macro      : require('./macro')(app),
		notfound   : function(req, res) {
			res.jsonp(404, { error: 'Not found' });
		}
	};
};
