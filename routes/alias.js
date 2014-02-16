var _        = require('underscore');
var request  = require('request');

module.exports = function(app) {
	return function(req, res) {
		var url = req.params[0];
		var endFlag = false;

		// From reirect-map.js
		var redirectMap = app.get('aliasMap');
		_.keys(redirectMap).forEach(function(api) {
			if (url === api) {
				endFlag = true;
				if (typeof(redirectMap[api]) === 'string') {
					var redirect = app.get('address') + redirectMap[api];
					request.get(redirect).pipe(res);
				} else {
					var results = [];
					redirectMap[api].forEach(function(url) {
						var redirect = app.get('address') + url;
						request.get({url: redirect, json: true}, function(err, result, json) {
							if (err) throw err;
							results.push({
								api    : url,
								result : json
							});
							if (results.length === redirectMap[api].length) {
								console.log(results);
								res.jsonp({ results: results });
							}
						});
					});
				}
			}
		});
		if (endFlag) return;

		// iRemocon
		_.chain(app.get('iRemocon').irMap).invert().keys().each(function(keys) {
			keys.split(',').forEach(function(key) {
				var api = '/' + key.replace(/\s/g, '/');
				if (url.match(api) && !endFlag) {
					endFlag = true;
					var redirect = app.get('address') + '/device/iremocon/is' + url;
					request.get(redirect).pipe(res);
				}
			});
		});
		if (endFlag) return;

		request.get(app.get('address') + '/404').pipe(res);
	};
};
