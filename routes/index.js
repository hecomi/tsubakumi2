var request = require('request');

module.exports = function(app) {
	return {
		device : require('./device')(app),
		macro : require('./macro')(app),
		setIremoconAlias : function() {
		},
		notfound : function(req, res) {
			res.status(404);
			throw new Error(req.url + ' is not found.');
		}
	};
};
