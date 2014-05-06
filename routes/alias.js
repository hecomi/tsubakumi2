var _        = require('underscore');
var request  = require('request');
var get      = require('../utilities').get;

module.exports = function(app) {

	var aliasMapHandler = function(req, res) {
		var url = req.params[0];
		var endFlag = false;
		var aliasMap = app.get('aliasMap');

		_.keys(aliasMap).forEach(function(api) {
			if (url === api) {
				endFlag = true;
				var alias = aliasMap[api] instanceof Array ? aliasMap[api] : [ aliasMap[api] ];
				var results = [];
				alias.forEach(function(url) {
					get(url, function(json) {
						results.push({
							url    : url,
							result : json
						});
						if (results.length === alias.length) {
							res.jsonp({
								type    : 'alias',
								alias   : alias,
								results : results
							});
						}
					});
				});
			}
		});

		return endFlag;
	};

	var iRemoconHandler = function(req, res) {
		var url = req.params[0];
		var endFlag = false;

		_.chain(app.get('iRemocon').irMap).invert().keys().each(function(keys) {
			keys.split(',').forEach(function(key) {
				var api = '/' + key.replace(/\s/g, '/');
				if (url.match(api) && !endFlag) {
					endFlag = true;
					get('/device/iremocon/is' + url, function(json) {
						res.jsonp({
							url    : url,
							alias  : '/device/iremocon/is' + url,
							type   : 'alias-iRemocon',
							result : json
						});
					});
				}
			});
		});

		return endFlag;
	};

	return function(req, res) {
		var endFlag = false;

		if (aliasMapHandler(req, res)) return;
		if (iRemoconHandler(req, res)) return;

		request.get(app.get('address') + '/404').pipe(res);
	};
};
