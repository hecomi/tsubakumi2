var domain = require('domain');

var d = domain.create();
d.run(function() {
	require('./settings/event-map').forEach(function(event) {
		console.log('[%s] registered', event.name);
		var cnt = 0;
		setInterval(function() {
			console.log('[%s,\t%d times,\t%s] fired', event.name, cnt, new Date());
			event.func(cnt++);
		}, event.interval * 1000);
	});
});
d.on('error', console.error);
