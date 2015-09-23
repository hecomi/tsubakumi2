var netatmo  = require('netatmo');

var routes = app => {
	var api = new netatmo(app.get('netatmo'));

	var room = (res, devices) => {
		devices.forEach(device => {
			api.getMeasure({
				device_id : device._id,
				scale     : '30min',
				type      : ['Temperature', 'Humidity', 'Pressure', 'Noise', 'CO2']
			}, (err, measure) => {
				if (err) throw err;
				measure.forEach(result => {
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

	var outside = (res, devices) => {
		devices.forEach(device => {
			api.getMeasure({
				device_id : device._id,
				scale     : '30min',
				module_id : device.modules[0],
				type      : ['Temperature', 'Humidity']
			}, (err, measure) => {
				if (err) throw err;
				measure.forEach(result => {
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

	return (req, res) => {
		api.getDevicelist((err, devices, modules) => {
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

module.exports = app => {
	var api = routes(app);
	app.get('/device/netatmo/:api', api);
};
