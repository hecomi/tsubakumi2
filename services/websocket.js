var io       = require('socket.io')();
var settings = require('../settings');
var aliases  = require('../settings/alias-map.js');
var util     = require('util');
var _        = require('underscore');

// TODO: キャッシュして複合イベントも検知
//       ただこれをやるためには get 系の API の整理も必要...
var renamedAddresses = _.chain(aliases)
	.omit(value => !_.isString(value))
	.mapObject(val => {
		return val.replace(/\%s/g, '([^/]*)') + '$';
	})
	.invert()
	.mapObject(val => {
		return val.replace('([^/]*)', '%s').replace('(.*)$', '%s');
	})
	.value();

io.on('connection', socket => {
	socket.on('broadcast', msg => {
		var address = msg.address;
		var data    = msg.data;

		io.sockets.emit(address, data);

		for (var src in renamedAddresses) {
			var dst = renamedAddresses[src];
			if (address.match(new RegExp(src))) {
				var alias = util.format(dst, RegExp.$1, RegExp.$2, RegExp.$3).trim();
				io.sockets.emit(alias, _.extend(data, {
					parent: address
				}));
			}
		}
	});
});

io.listen(settings.websocket.port);
