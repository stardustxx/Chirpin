var socket = io('/chat');
var user = new Object();
user.username = '';
user.room = '';

var room = "";
var fullMessage = new Object();
fullMessage.name = "";
fullMessage.msg = "";

$('form').submit(function(){
    fullMessage.name = user.username;
    fullMessage.msg = $('#m').val();
    socket.emit('chat message' , fullMessage);
    $('#m').val('');
    return false;
});

socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg.username + ": " + msg.msg)); 
});

socket.on('who', function(obj){
    user.username = obj.username;
    user.room = obj.room;
    console.log(user);
});

socket.on('login', function(obj){
    $('#messages').append($('<li>').text(obj.username + " has logged in"));  
});

socket.on('dc', function(msg){
    $('#messages').append($('<li>').text(msg + " has gone"));
});

$(window).on('beforeunload', function(){
    socket.close();
});