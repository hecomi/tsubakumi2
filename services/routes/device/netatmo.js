var netatmo  = require('netatmo');

module.exports = function(app) {
	var api = new netatmo(app.get('netatmo'));

	var room = function(res, devices) {
		devices.forEach(function(device) {
			api.getMeasure({
				device_id : device._id,
				scale     : '30min',
				type      : ['Temperature', 'Humidity', 'Pressure', 'Noise', 'CO2']
			}, function(err, measure) {
				if (err) throw err;
				measure.forEach(function(result) {
					var last      = result.value.length - 1;
					var timestamp = (result.beg_time + result.step_time * last) * 1000;
					var val       = result.value[last];
					res.jsonp({
						timestamp   : timestamp,
						temperature : val[0],
						humidity    : val[1],
						pressure    : val[2],
						noise       : val[3],
						co2         : val[4],
						raw			: result
					});
				});
			});
		});
	};

	var outside = function(res, devices) {
		devices.forEach(function(device) {
			api.getMeasure({
				device_id : device._id,
				scale     : '30min',
				module_id : device.modules[0],
				type      : ['Temperature', 'Humidity']
			}, function(err, measure) {
				if (err) throw err;
				measure.forEach(function(result) {
					var last      = result.value.length - 1;
					var timestamp = (result.beg_time + result.step_time * last) * 1000;
					var val       = result.value[last];
					res.jsonp({
						timestamp   : timestamp,
						temperature : val[0],
						humidity    : val[1],
						raw			: result
					});
				});
			});
		});
	};

	return function(req, res) {
		api.getDevicelist(function(err, devices, modules) {
			if (err) throw err;
			switch (req.params.api) {
				case 'inside':
				case 'room':
					room(res, devices);
					break;
				case 'outside':
					outside(res, devices);
					break;
			}
		});
	};
};

