var settings      = require('../settings').blink1;
var Blink1        = require('node-blink1');
var blink1        = new Blink1(settings.serial);

module.exports = {
	color: (r, g, b) => {
		setColor(first, second);
	},
	red: () => {
		blink1.setRGB(200, 0, 0);
	},
	green: () => {
		blink1.setRGB(0, 200, 0);
	},
	blue: () => {
		blink1.setRGB(0, 0, 200);
	}
};
