var socket = io('/chat');
var user = new Object();
user.username = '';
user.room = '';
user.name = ''

var room = "";
var fullMessage = new Object();
fullMessage.name = "";
fullMessage.msg = "";

$('#submit').click(function(){
    fullMessage.name = user.username;
    fullMessage.msg = $('#m').val();
    socket.emit('chat message' , fullMessage);
    $('#m').val('');
    return false;
});

$('form').submit(function(){
    fullMessage.name = user.username;
    fullMessage.msg = $('#m').val();
    socket.emit('chat message' , fullMessage);
    $('#m').val('');
    return false;
});

socket.on('chat message', function(msg){
    var $msgusername = '<span class = "username">' + msg.username + '</span>';
    var $message = $('<li>').html('<paper-shadow z = "1">' + $msgusername + ": " + msg.msg + '</paper-shadow>');
    //var $div = $('<div>').html($message);
    $('#messages').append($message); 
});

socket.on('who', function(obj){
    user.username = obj.username;
    user.name = obj.name;
    user.room = obj.room;
    console.log(user);
});

socket.on('login', function(obj){
    var $msgusername = '<span class = "username">' + obj.username + '</span>';
    var str = $msgusername + ": Hi my name is " + obj.name + ", but you can call me " + obj.username;
    $('#messages').append($('<li>').html('<paper-shadow z = "1">' + str + '</paper-shadow>'));  
});

socket.on('dc', function(msg){
    $('#messages').append($('<li>').text(msg + " has gone"));
});

$(window).on('beforeunload', function(){
    socket.close();
});