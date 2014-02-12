module.exports = function(app) {
	return {
		room: require('./room')(app)
	};
};
