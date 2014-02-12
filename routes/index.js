module.exports = function(app) {
	return {
		device : require('./device')(app),
		place  : require('./place')(app),
		notfound : function(req, res) {
			res.status(404);
			throw new Error(req.url + ' is not found.');
		}
	};
};
