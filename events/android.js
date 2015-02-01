var _             = require('underscore');
var settings      = require('../settings');
var gcm           = require('node-gcm');

module.exports = {
	send: function(opts) {
		var message = new gcm.Message({
			collapseKey    : 'tsubakumi',
			timeToLive     : 3,
			delayWhileIdle : false,
			data           : {
				timestamp: +new Date(),
				json: JSON.stringify(_.extend(
					settings.gcm.messageTemplate, opts))
			}
		});

		var sender = new gcm.Sender(settings.gcm.sender);
		sender.send(message, settings.gcm.registrationIds, 4, function (err, result) {
			console.log(result);
		});
	}
};
