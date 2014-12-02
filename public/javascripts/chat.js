var socket = io();
var username = "";
var fullMessage = new Object();
fullMessage.name = "";
fullMessage.msg = "";

$('form').submit(function(){
    fullMessage.name = username;
    fullMessage.msg = $('#m').val();
    socket.emit('chat message' , fullMessage);
    $('#m').val('');
    return false;
});

socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg.username + ": " + msg.msg)); 
});

socket.on('who', function(obj){
    username = obj.username;
});

socket.on('login', function(obj){
    if (obj.type == 'login') {
        $('#messages').append($('<li>').text(obj.username + " has logged in"));  
    }
});
