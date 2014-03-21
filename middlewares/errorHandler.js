module.exports = function(err, req, res, next) {
	console.error('--------------------------------------------------------------------------------');
	console.error('Error on request %d %s %s', process.domain.id, req.method, req.url);
	console.error(err);
	console.error('--------------------------------------------------------------------------------');
	res.jsonp(500, {
		error: err.stack
	});
};
