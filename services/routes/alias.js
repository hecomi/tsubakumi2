var _    = require('underscore');
var get  = require('../utils').get;
var util = require('util');

module.exports = app => {

	var aliasMapHandler = (req, res) => {
		var url = req.params[0];
		var endFlag = false;
		var aliasMap = app.get('aliasMap');

		_.keys(aliasMap).forEach(api => {
			if ( url.match(new RegExp(api)) ) {
				var args = [RegExp.$1, RegExp.$2, RegExp.$3];
				endFlag = true;
				var aliases = aliasMap[api] instanceof Array ? aliasMap[api] : [ aliasMap[api] ];
				var results = [];
				aliases.forEach(alias => {
					alias = util.format(alias, args[0], args[1], args[2]);
					get(alias, json => {
						results.push({
							url    : alias,
							result : json
						});
						if (results.length === aliases.length) {
							res.jsonp({
								type    : 'alias',
								url     : url,
								alias   : aliases,
								results : results
							});
						}
					});
				});
			}
		});

		return endFlag;
	};

	var iRemoconHandler = (req, res) => {
		var url = req.params[0];
		var endFlag = false;

		_.chain(app.get('iRemocon').irMap).invert().keys().each(keys => {
			keys.split(',').forEach(key => {
				var api = '/' + key.replace(/\s/g, '/');
				if (url.match(api) && !endFlag) {
					endFlag = true;
					get('/device/iremocon/is' + url, json => {
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

	return (req, res) => {
		var endFlag = false;

		if (aliasMapHandler(req, res)) return;
		if (iRemoconHandler(req, res)) return;

		get('/404', json => { res.jsonp(json); });
	};
};
