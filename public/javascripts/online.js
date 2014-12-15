var username = "";

var socket = io();

socket.on('who', function(obj){
    username  = obj.username; 
});