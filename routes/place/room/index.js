module.exports = function(app) {
	return {
		light : require('./light')(app)
	};
};
