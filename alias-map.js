module.exports = {
	// monitors
	'/mac/monitor/on'      : '/device/wemo/switch/monitor/on',
	'/mac/monitor/off'     : '/device/wemo/switch/monitor/off',
	'/mac/monitor/state'   : '/device/wemo/switch/monitor/state',
	'/windows/monitor/on'  : '/monitor/on',
	'/windows/monitor/off' : '/monitor/off',
	'/all/monitor/on'      : ['/mac/monitor/on', '/windows/monitor/on'],
	'/all/monitor/off'     : ['/mac/monitor/off', '/windows/monitor/off'],

	// lights
	'/entrance/light/on'  : '/device/hue/on/1',
	'/entrance/light/off' : '/device/hue/off/1',
	'/kitchen/light/on'   : ['/device/hue/on/2', '/device/hue/on/3'],
	'/kitchen/light/off'  : ['/device/hue/off/2', '/device/hue/off/3'],
	'/room/light/on'      : '/light/on',
	'/room/light/off'     : '/light/off',
	'/hallway/light/on'   : ['/entrance/light/on', '/kitchen/light/on'],
	'/hallway/light/off'  : ['/entrance/light/off', '/kitchen/light/off'],
	'/all/light/on'       : ['/hallway/light/on', '/room/light/on'],
	'/all/light/off'      : ['/hallway/light/off', '/room/light/off'],

	// projector
	'/projector/shutdown' : '/macro/projector/shutdown',

	// wemo
	'/entrance/motion' : '/device/wemo/motion/entrance/state',

	// ps3
	'/ps3/torne' : '/macro/ps3/torne'
};
