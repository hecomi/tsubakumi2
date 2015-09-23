var inbox    = require('inbox');
var _        = require('underscore');
var settings = require('../settings');
var utils    = require('../utils');

var client = inbox.createConnection(false, 'imap.gmail.com', {
	secureConnection: true,
	auth: settings.gmail
});

client.on('connect', () => {
	console.log('connected');
	client.openMailbox('INBOX', error => {
		if (error) throw error;
	});
});

client.on("new", msg => {
	if (_.findWhere(msg.to, { address: settings.gmail.trigger_address })) {
		utilities.query(msg.title);
	}
});

client.connect();
