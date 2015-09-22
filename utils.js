var fs = require('fs');
var _  = require('underscore');

var files = _.chain(fs.readdirSync('./utils'))
	.filter(path => (path.indexOf('.js') != -1))
	.map(path => path.replace('.js', ''))
	.each(path => {
		module.exports[path] = require('./utils/' + path);
	});
