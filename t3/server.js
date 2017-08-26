var static = require('node-static');
var http = require('http');
var file = new(static.Server)();
var app = http.createServer(function (req, res) {
    file.serve(req, res);
}).listen(8080);

var io = require('socket.io').listen(app);
io.sockets.on('connection', function (socket){
    socket.emit('hello', 'hello from io!');

    socket.on('message', function (message) {
        console.log('Got message: ', message);
        //socket.broadcast.send('message', message); // should be room only
        socket.emit('message', message);
    });
});