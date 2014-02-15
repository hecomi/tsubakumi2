module.exports = function(app) {
	return function(req, res) {
		var api = req.params[0];
		console.log(api);
		res.jsonp({});
	};
};
