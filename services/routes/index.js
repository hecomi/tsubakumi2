module.exports = app => {
	return {
		device     : require('./device')(app),
		macro      : require('./macro')(app),
		alias      : require('./alias')(app),
	};
};
