module.exports = app => {
	return {
		device     : require('./device')(app),
		macro      : require('./macro')(app),
		notfound   : (req, res) => {
			res.jsonp(404, { error: 'Not found' });
		}
	};
};
