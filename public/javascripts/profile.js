var username = "";

var socket = io();

var $chatBtn = $("#chatBtn");
$chatBtn.click(function(){
    $('.beaker').fadeTo('slow', 0.5);
    $('#loading').fadeIn('slow');2
});

socket.on('who', function(obj){
    username  = obj.username; 
});