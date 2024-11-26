var app = require('express')();
var server = require('http').createServer(app);
// http server를 socket.io server로 upgrade한다
var io = require('socket.io')(server);
// localhost:3000으로 서버에 접속하면 클라이언트로 index.html을 전송한다
 
var fs = require('fs')
 
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
server.listen(3000, function() {
    console.log('Socket IO server listening on port 3000');
});
io.on('connection', function(socket) {
    socket.on('hello', function(data) {
        console.log('Message from Client: ' + data);
        socket.emit("hello", "re>>" + data);
    });
 
    socket.on("upload", (file, callback) => {
        console.log(file);
        // save the content to the disk, for example
            fs.writeFile(__dirname +"/uploads/" + file.Name, file.Data, (err) => {
                socket.emit("isfinish", "Finish~");
            });
    });
});
 
 