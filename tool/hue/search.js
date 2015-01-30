var hue = require("node-hue-api");

hue.nupnpSearch(function(err, result) {
	if (err) throw err;
	console.log("Hue Bridge Found:", JSON.stringify(result));
});
