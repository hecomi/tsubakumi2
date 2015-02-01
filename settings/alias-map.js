module.exports = {
	// all
	'/restart'  : '/macro/restart',
	'/all/off'  : ['/all/light/off', '/all/monitor/off'],
	'/room/off' : ['/room/light/off', '/all/monitor/off'],
	'/room/on'  : ['/room/light/on', '/all/monitor/on'],

	// monitors
	'/right/monitor/on'    : '/device/wemo/switch/monitor1/on',
	'/right/monitor/off'   : '/device/wemo/switch/monitor1/off',
	'/right/monitor/state' : '/device/wemo/switch/monitor1/state',
	'/left/monitor/on'     : '/device/wemo/switch/monitor2/on',
	'/left/monitor/off'    : '/device/wemo/switch/monitor2/off',
	'/left/monitor/state'  : '/device/wemo/switch/monitor2/state',
	'/all/monitor/on'      : ['/left/monitor/on', '/right/monitor/on'],
	'/all/monitor/off'     : ['/left/monitor/off', '/right/monitor/off'],

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
