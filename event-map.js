var request = require('request');

module.exports = function(app) {
	var get = function(api, callback) {
		return request.get({
			url  : app.get('address') + api,
			json : true
		}, function(err, res, json) {
			if (err) throw err;
			if (typeof(callback) === 'function') callback(json);
		});
	};

	return [
		{
			name     : 'hallway light',
			interval : 1000,
			func     : function() {
				get('/entrance/motion', function(json) {
					var newState = parseInt(json.state, 10);
					if (newState !== app.get('hallway light state')) {
						app.set('hallway light state', newState);
						if (app.get('hallway light state')) {
							get('/hallway/light/on');
						} else {
							get('/hallway/light/off');
						}
					}
				});
			}
		}
	];
};
