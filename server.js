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

  // Generate a random code and join it as a room
  var random = (Math.random() + '').substr(3, 4);
  var room_id = 'room_'+random;
  socket.join(room_id);
  io.to(room_id).emit('joined_room', room_id);
  

  socket.on('join_room', function(room, callback){
    console.log('Join request: ' + room);

    if(io.sockets.adapter.rooms[room]){
      room_id = room;
      
      socket.join(room);
      io.to(room_id).emit('client_conneted');
      console.log('Joined room');
      callback(true);
    }
    else{
      console.log('Asked to join a room that doesn\t exist');
      callback(false);
    }
  });

  socket.on('do', function(data){
    io.to(room_id).emit('do', data);
  });

  socket.on('disconnect', function(){
    console.log('User disconnected');
  });
});


var port = Number(process.env.PORT || 3000);
http.listen(port, function(){
  console.log('listening on *:3000');
});