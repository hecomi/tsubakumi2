var hue = new (require("node-hue-api").HueApi);
var ip  = require('../../settings').hue.ip;

hue.createUser(ip, null, null, function(err, user) {
    if (err) throw err;
	console.log(JSON.stringify(user));
});
