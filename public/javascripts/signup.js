var nameF, nameL, nickname, email, password;
var loginurl = "/login";

$('#submitBtn').click(function(){
    nameF = $('#nameF').val();
    nameL = $('#nameL').val();
    nickname = $('#nickname').val();
    email = $('#email').val();
    password = $('#password').val();
    var status = 0;
    
    if (nameF == "") {
        $('#nameF').css('background-color', 'red');
    }
    else {
        $('#nameF').css('background-color', '');
        status += 1;
    }

    if (nameL == ""){
        $('#nameL').css('background-color', 'red');
    }
    else {
        $('#nameL').css('background-color', '');
        status += 1;
    }

    if (nickname == ""){
        $('#nickname').css('background-color', 'red');
    }
    else {
        $('#nickname').css('background-color', '');
        status += 1;
    }

    if (email == ""){
        $('#email').css('background-color', 'red');
    }
    else {
        $('#email').css('background-color', '');
        status += 1;
    }

    if (password == ""){
        $('#password').css('background-color', 'red');
    }
    else {
        $('#password').css('background-color', '');
        status += 1;
    }
    
    if (status == 5) {
        //$('#signupForm').submit();
        $.post("/registration", {nameF: nameF, nameL: nameL, nickname: nickname, email: email, password: password}, function(data){
            if (data == "email") {
                console.log('Email used');
                $('.warning').text("Email has been used");
            }
            else if (data == "nickname"){
                console.log('nickname used');
                $('.warning').text("Nickname has been used");
            }
            else if (data == "success"){
                console.log('success');
                $(location).attr('href', loginurl);
            }
        });
    }
    
});

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-58064324-1', 'auto');
  ga('send', 'pageview');