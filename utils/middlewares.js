var blink1 = require('./blink1');

module.exports = {
	successHandler: (req, res, next) => {
		blink1.green();
		next();
	},
	errorHandler: (err, req, res, next) => {
		console.error('--------------------------------------------------------------------------------');
		console.error('Error on request %d %s %s', process.domain.id, req.method, req.url);
		console.error(err.stack);
		console.error('--------------------------------------------------------------------------------');
		blink1.red();
		res.jsonp(500, {
			error: err.stack
		});
	}
};
