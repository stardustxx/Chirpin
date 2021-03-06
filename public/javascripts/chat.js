var socket = io('/chat');
var user = new Object();
user.username = '';
user.room = '';
user.name = ''

var $messages = $('#messages');

var room = "";
var fullMessage = new Object();
fullMessage.name = "";
fullMessage.msg = "";

var seebot = function(){
    $messages[0].scrollTop = $messages[0].scrollHeight;
    return false;
}

$('#submit').click(function(){
    fullMessage.name = user.username;
    fullMessage.msg = $('#m').val();
    socket.emit('chat message' , fullMessage);
    $('#m').val('');
    seebot();
    return false;
});

$('form').submit(function(){
    fullMessage.name = user.username;
    fullMessage.msg = $('#m').val();
    socket.emit('chat message' , fullMessage);
    $('#m').val('');
    seebot();
    return false;
});

socket.on('chat message', function(msg){
    var $li = $('<li>');
    var $msgusername = '<span class = "username">' + msg.username + '</span>';
    var $message = $li.html('<paper-shadow z = "1">' + $msgusername + "<br>" + msg.msg + '</paper-shadow>');
    if (msg.username == user.username) {
        $li.addClass('yourchat');
    }
    else if (msg.username != user.username) {
        $li.addClass('otherschat');
    }
    $('#messages').append($message); 
    
    $message.hide().fadeIn();
    seebot();
});

socket.on('who', function(obj){
    user.username = obj.username;
    user.name = obj.name;
    user.room = obj.room;
});

socket.on('prep', function(){
    socket.emit('login', user);
});

socket.on('waiting', function(){
    var $li = $('<li>');
    var $message = 'Waiting...';
    $li.addClass('waiting');
    $('#messages').append($li.html('<paper-shadow z = "1">' + $message + '</paper-shadow>'));
})

socket.on('login', function(obj){
    var $li = $('<li>');
    var $msgusername = '<span class = "username">' + obj.username + '</span>';
    var str = $msgusername + "<br>" + "Hi there, you can call me " + obj.username;
    var $message = $li.html('<paper-shadow z = "1">' + str + '</paper-shadow>');
    if (obj.username == user.username) {
        $li.addClass('yourchat');
    }
    else if (obj.username != user.username) {
        $li.addClass('otherschat');
    }
    
    $('#messages').append($message);  
    $message.hide().fadeIn();
    seebot();
});

socket.on('dc', function(msg){
    console.log(msg);
    var $li = $('<li>');
    var $msg = '<span class = "username">' + msg + '</span>';
    var str = $msg + ' has gone';
    $li.addClass('dc');
    var $message = $li.html('<paper-shadow z = "1">' + str + '</paper-shadow>');
    $('#messages').append($message);
    $message.hide().fadeIn();
    seebot();
});

$(window).on('beforeunload', function(){
    socket.close();
});




(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-58064324-1', 'auto');
  ga('send', 'pageview');