var net = require('net');

var server = net.createServer(function (socket) {
    socket.on('data', function (data) { console.log(data.toString('ascii')); });
});

server.listen(9999, '10.0.0.100');
