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



(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-58064324-1', 'auto');
  ga('send', 'pageview');