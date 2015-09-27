var Timer = () => {
	this.timer = null;
};

Timer.prototype = {
	start: (func, time) => {
		if (this.timer !== null) {
			clearTimeout(this.timer);
		}
		this.timer = setTimeout(() => {
			func();
			this.timer = null;
		}, time);
	},
	stop: () => {
		if (this.timer !== null) {
			clearTimeout(this.timer);
			this.timer = null;
		}
	},
	isRunning: () => {
		return this.timer !== null;
	}
};

module.exports = Timer;
