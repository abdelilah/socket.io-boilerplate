var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');


// Setting ExpressJS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static('./public'));


// Main Route
app.get('/', function(req, res){
  res.sendfile('public/index.html');
});

app.post('/', function(req, res){
  res.json(req.body);
});


// Socket.IO
io.on('connection', function(socket){
  console.log('User connected');

  socket.on('something', function(data, callback){
    console.log('Something happened: ' + data);
  });

  socket.on('disconnect', function(){
    console.log('User disconnected');
  });
});


var port = Number(process.env.PORT || 3000);
http.listen(port, function(){
  console.log('listening on *:3000');
});