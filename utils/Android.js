var _        = require('underscore');
var gcm      = require('node-gcm');
var settings = require('../settings');

module.exports = {
	send: opts => {
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
		sender.send(message, settings.gcm.registrationIds, 4, (err, result) => {
			console.log(result);
		});
	}
};
