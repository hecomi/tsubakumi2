var fs = require('fs');
var _  = require('underscore');

var thisFile = __filename.split('/').pop();

var files = _.chain(fs.readdirSync(__dirname))
	.filter(path => (path.indexOf('.js') != -1))
	.filter(file => file != thisFile)
	.map(path => path.replace('.js', ''))
	.each(path => {
		module.exports[path] = require('./' + path);
	});
