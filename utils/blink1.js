var settings = require('../settings').blink1;
var Blink1 = require('node-blink1');
var isFound = true;
try {
	var blink1 = new Blink1(settings.serial);
} catch (e) {
	console.error(e.stack);
	isFound = false;
}

module.exports = {
	color: (r, g, b) => {
		if (isFound) setColor(first, second);
	},
	red: () => {
		if (isFound) blink1.setRGB(200, 0, 0);
	},
	green: () => {
		if (isFound) blink1.setRGB(0, 200, 0);
	},
	blue: () => {
		if (isFound) blink1.setRGB(0, 0, 200);
	}
};

process.on('uncaughtException', err => {
	console.error(err.stack);
});
