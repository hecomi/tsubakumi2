var request = require('request');
var printf  = require('printf');

module.exports = function(app) {
	return {
		device   : require('./device')(app),
		macro    : require('./macro')(app),
		redirect : function(req, res) {
			var url = printf('http://%s/device/iremocon/is%s', app.get('address'), req.params[0]);
			request.get(url).pipe(res);
		},
		notfound : function(req, res) {
			res.status(404);
			throw new Error(req.url + ' is not found.');
		}
	};
};
