var domain = require('domain');

var d = domain.create();
d.run(function() {
	require('./settings/event-map').forEach(function(event) {
		console.log('[%s] registered', event.name);
		if (event.type === 'interval') {
			var cnt = 0;
			setInterval(function() {
				console.log('[%s,\t%d times, %s] fired', event.name, cnt, new Date());
				event.func(cnt++);
			}, event.interval * 1000);
		} else if (event.type === 'realtime') {
			event.func();
		}
	});
});
d.on('error', console.error);
