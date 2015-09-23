var hue         = require("node-hue-api");
var HueApi      = hue.HueApi;
var lightState  = hue.lightState;
var lightStates = [];

var InvalidApiError = msg => {
	var e = new Error(msg);
	e.name = 'InvalidApiError';
	return e;
};

var routes = app => {
	return (req, res) => {
		var api = new HueApi(app.get('hue').ip, app.get('hue').user);
		var callHueApi = (apiName, arg1, arg2) => {
			var callback = (err, result) => {
				if (err) throw err;
				if (typeof(result) !== 'object') {
					res.jsonp({ result: result });
				} else {
					res.jsonp(result);
				}
			};
			if (arg2) {
				api[apiName](arg1, arg2, callback);
			} else if (arg1) {
				api[apiName](arg1, callback);
			} else {
				api[apiName](arg1, callback);
			}
		};

		var arg1  = req.params.arg1;
		var arg2  = req.params.arg2;
		var arg3  = req.params.arg3;
		var state = lightStates[arg1] || (lightStates[arg1] = lightState.create());

		switch (req.params.api) {
			// TODO: implement all hue apis
			case 'lights':
				callHueApi('lights');
				break;
			case 'fullState':
				callHueApi('getFullState');
				break;
			case 'registeredUsers':
				callHueApi('registeredUsers');
				break;
			case 'lightStatus':
				callHueApi('lightStatus');
				break;
			case 'on':
				if (!arg1) throw InvalidApiError('"on" needs at least one parameter');
				state.on();
				if (arg2) state.transition(arg2);
				callHueApi('setLightState', arg1, state);
				break;
			case 'off':
				if (!arg1) throw InvalidApiError('"off" needs at least one parameter');
				state.off();
				if (arg2) state.transition(arg2);
				callHueApi('setLightState', arg1, state);
				break;
			case 'rgb':
				if (!arg1 || !arg2) throw InvalidApiError('"rgb" needs at least two parameters');
				var rgb = arg2.split(',');
				state.rgb(rgb[0], rgb[1], rgb[2]);
				if (arg3) state.transition(arg3);
				callHueApi('setLightState', arg1, state);
				break;
			case 'hsl':
				if (!arg1 || !arg2) throw InvalidApiError('"hsl" needs at least two parameters');
				var hsl = arg2.split(',');
				state.hsl(hsl[0], hsl[1], hsl[2]);
				if (arg3) state.transition(arg3);
				callHueApi('setLightState', arg1, state);
				break;
			case 'xy':
				if (!arg1 || !arg2) throw InvalidApiError('"xy" needs at least two parameters');
				var xy = arg2.split(',');
				state.xy(xy[0], xy[1]);
				if (arg3) state.transition(arg3);
				callHueApi('setLightState', arg1, state);
				break;
			case 'white':
				if (!arg1 || !arg2) throw InvalidApiError('"white" needs at least two parameters');
				var white = arg2.split(',');
				state.white(white[0], white[1]);
				if (arg3) state.transition(arg3);
				callHueApi('setLightState', arg1, state);
				break;
			case 'brightness':
				if (!arg1 || !arg2) throw InvalidApiError('"white" needs at least two parameters');
				state.brightness(parseInt(arg2));
				if (arg3) state.transition(arg3);
				callHueApi('setLightState', arg1, state);
				break;
			case 'alert':
				if (!arg1) throw InvalidApiError('"white" needs at least two parameters');
				if (arg2) { state.alert(arg2); }
				else      { state.alert();     }
				callHueApi('setLightState', arg1, state);
				break;
			default:
				throw InvalidApiError('"' + req.params.api + '" is not hue API');
		}
	};
};

module.exports = app => {
	var api = routes(app);
	app.get('/device/hue/:api', api);
	app.get('/device/hue/:api/:arg1', api);
	app.get('/device/hue/:api/:arg1/:arg2', api);
	app.get('/device/hue/:api/:arg1/:arg2/:arg3', api);
};
