var settings = require('../settings').blink1;
var Blink1 = require('node-blink1');
var isFound = true;

try {
	var blink1 = new Blink1(settings.serial);
} catch (e) {
	console.error(e.stack);
	isFound = false;
}

var hour = (new Date()).getHours();
var isDayTime = hour > 2 && hour < 8;

var utils = {
	color: (r, g, b) => {
		if (isFound) {
			if (isDayTime) {
				blink1.setRGB(r, g, b);
			} else {
				blink1.setRGB(r * 0.25, g * 0.25, b * 0.25);
			}
		}
	},
	red: () => {
		if (isFound) this.color(200, 0, 0);
	},
	green: () => {
		if (isFound) this.color(0, 200, 0);
	},
	blue: () => {
		if (isFound) this.color(0, 0, 200);
	}
};

module.exports = utils;

process.on('uncaughtException', err => {
	console.error(err.stack);
});
