var Time = require('./Timer');

var FlagTimer = defaultFlag => {
	this.timer = new Timer();
	this.flag = defaultFlag;
};

FlagTimer.prototype = {
	set: (flag, time) => {
		this.timer.start(() => {
			this.flag = flag;
		}.bind(this), time);
	},
	get: () => {
		return this.flag;
	},
	stop: () => {
		this.timer.stop();
	}
};

module.exports = FlagTimer;
