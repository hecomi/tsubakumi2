var fs = require('fs');
var _  = require('underscore');

var files = _.chain(fs.readdirSync(__dirname))
	.filter(file => file.indexOf('.js') !== -1)
	.filter(file => file != __filename.split('/').pop())
	.map(file => file.replace('.js', ''))
	.value();

module.exports = app => {
	var routes = {};
	files.forEach(file => {
		routes[file] = require('./' + file)(app);
	});
	return routes;
};
