var nameF, nameL, nickname, email, password;
var profileurl = "/profile";

$('#submitBtn').click(function(){
    email = $('#email').val();
    password = $('#password').val();
    var status = 0;
    
    if (email == "") {
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
    
    if (status == 2) {
        $('.warning').text("");
        $.post("/loginCheck", {email: email, password: password}, function(data){
            if (data == "success"){
                console.log('success');
                $(location).attr('href', profileurl);
            }
            else if (data == "null"){
                console.log('No user found');
                $('.warning').text("Please double check your email and password");
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