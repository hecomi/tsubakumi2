var domain = require('domain');

var d = domain.create();
d.run(function() {
	require('./settings/event-map').forEach(function(event) {
		setInterval(event.func, event.interval);
	});
});
d.on('error', console.error);
