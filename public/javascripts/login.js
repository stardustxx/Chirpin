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