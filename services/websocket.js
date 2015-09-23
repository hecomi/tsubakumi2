var io = require('socket.io')();
var settings = require('../settings');

io.on('connection', socket => {
	socket.on('broadcast', msg => {
		console.log(msg.address);
		io.sockets.emit(msg.address, msg.data);
	});
});

io.listen(settings.websocket.port);
