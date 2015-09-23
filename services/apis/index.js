var fs = require('fs');

var thisFile = __filename.split('/').pop();

var files = fs.readdirSync(__dirname)
	.filter(file => file.indexOf('.js') !== -1)
	.filter(file => file != thisFile)
	.map(file => file.replace('.js', ''));

module.exports = app => {
	var routes = {};
	files.forEach(file => {
		routes[file] = require('./' + file)(app);
	});
	return routes;
};
