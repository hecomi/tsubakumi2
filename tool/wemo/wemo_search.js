var SSDP   = require('node-ssdp')
  , client = new SSDP()
;
setInterval(function() {
	client.on('response', function (msg, rinfo) {
		console.log(msg.toString());
	});
	client.search('urn:Belkin:service:basicevent:1');
}, 2000);
