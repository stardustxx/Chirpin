//var nameF, nameL, nickname, email, password;
//
//$('.signup0').click(function(){
//    $('.beaker').fadeOut(function(){
//        $('.containerSign').fadeIn();
//    });
//});
//
//$('.login0').click(function(){
//    $('.beaker').fadeOut(function(){
//        $('.containerLog').fadeIn();
//    }) ;
//});
//
//$('.signup2').click(function(){
//    $('.containerLog').fadeOut(function(){
//        $('.containerSign').fadeIn();
//    });
//});
//
//$('.login1').click(function(){
//    $('.containerSign').fadeOut(function(){
//        $('.containerLog').fadeIn();
//    });
//});
//
//$('#submitBtn').click(function(){
//    nameF = $('#nameF').val();
//    nameL = $('#nameL').val();
//    nickname = $('#nickname').val();
//    email = $('#email').val();
//    password = $('#password').val();
//    var status = 0;
//    
//    if (nameF == "") {
//        $('#nameF').css('background-color', 'red');
//    }
//    else {
//        $('#nameF').css('background-color', '');
//        status += 1;
//    }
//
//    if (nameL == ""){
//        $('#nameL').css('background-color', 'red');
//    }
//    else {
//        $('#nameL').css('background-color', '');
//        status += 1;
//    }
//
//    if (nickname == ""){
//        $('#nickname').css('background-color', 'red');
//    }
//    else {
//        $('#nickname').css('background-color', '');
//        status += 1;
//    }
//
//    if (email == ""){
//        $('#email').css('background-color', 'red');
//    }
//    else {
//        $('#email').css('background-color', '');
//        status += 1;
//    }
//
//    if (password == ""){
//        $('#password').css('background-color', 'red');
//    }
//    else {
//        $('#password').css('background-color', '');
//        status += 1;
//    }
//    
//    if (status == 5) {
//        $('#signupForm').submit();
//    }
//    
//});