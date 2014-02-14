module.exports = function(app) {
	return {
		iremocon : require('./iremocon')(app),
		wemo     : require('./wemo')(app),
		hue      : require('./hue')(app)
	};
};
