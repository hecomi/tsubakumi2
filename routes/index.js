module.exports = function(app) {
	return {
		iremocon : require('./iremocon.js')(app),
		wemo     : require('./wemo.js')(app),
		notfound : function(req, res) {
			throw new Error(req.url + ' is invalid');
		}
	};
};
