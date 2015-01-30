module.exports = {
	// all
	'/restart' : '/macro/restart',

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
	'/toilet/light/on'    : '/device/hue/on/4',
	'/toilet/light/off'   : '/device/hue/off/4',
	'/lavatory/light/on'  : '/device/hue/on/5',
	'/lavatory/light/off' : '/device/hue/off/5',
	'/hallway/light/on'   : ['/entrance/light/on', '/kitchen/light/on'],
	'/hallway/light/off'  : ['/entrance/light/off', '/kitchen/light/off'],
	'/all/light/on'       : ['/hallway/light/on', '/room/light/on', '/toilet/light/on', '/lavatory/light/on'],
	'/all/light/off'      : ['/hallway/light/off', '/room/light/off', '/toilet/light/off', '/lavatory/light/off'],

	'/entrance/light/([^/]*)/(.*)$' : '/device/hue/%s/1/%s',
	'/kitchen/light/([^/]*)/(.*)$'  : ['/device/hue/%s/2/%s', '/device/hue/%s/3/%s'],
	'/hallway/light/([^/]*)/(.*)$'  : ['/entrance/light/%s/%s', '/kitchen/light/%s/%s'],
	'/toilet/light/([^/]*)/(.*)$'   : '/device/hue/%s/4/%s',
	'/lavatory/light/([^/]*)/(.*)$' : '/device/hue/%s/5/%s',
	'/all/light/([^/]*)/(.*)$'      : ['/hallway/light/%s/%s', '/toilet/light/%s/%s', '/lavatory/light/%s/%s'],

	// projector
	'/projector/shutdown'   : '/macro/projector/shutdown',
	'/projector/input/hdmi' : '/macro/projector/input/hdmi',

	// wemo motion
	'/entrance/motion' : '/device/wemo/motion/entrance/state',
	'/toilet/motion'   : '/device/wemo/motion/toilet/state',

	// ps3
	'/ps3/torne' : '/macro/ps3/torne'
};
