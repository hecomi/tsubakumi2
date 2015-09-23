var fs = require('fs');

var files = fs.readdirSync(__dirname + '/device')
	.filter(file => file.indexOf('.js') !== -1)
	.map(file => file.replace('.js', ''));

module.exports = app => {
	var routes = {};
	files.forEach(file => {
		routes[file] = require('./device/' + file)(app);
	});
	return routes;
};
