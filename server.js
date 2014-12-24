var express = require('express');
var app = express();
var session = require('express-session');
var server = require('http').Server(app);
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var io = require('socket.io')(server); // Let socket.io to listen on express port
var mongoose = require('mongoose');

var port = process.env.PORT || 8080;
var ip = process.env.IP || "127.0.0.1";

var index = require('./routes/index');
var chat = require('./routes/chat');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser({secret: "shirley"}));

var cookieEmail;
var chatRoom = ['room0'];

try {
    mongoose.connect('mongodb://stardustxx:eric12261226@ds063870.mongolab.com:63870/chirpin');
    //mongoose.connect('mongodb://localhost/users');  
    console.log('Mongoose conencted');
}
catch (err) {
    console.log(err);
}

var Schema = mongoose.Schema;

var userSchema = new Schema({
    nameF: {
        type: String,
        required: true
    },
    nameL: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        requried: true
    },
    birthday: {
        type: Number,
        required: true
    },
    language_main: {
        type: String
    },
    point: {
        type: Number   
    },
    online: {
        type: Boolean   
    },
    room: {
        type: String
    }
});

var user = mongoose.model('users', userSchema);

var controleRoom = function(arr, number){
    arr.splice(number, 1);
}

// On the /profile being online and standing by
io.on('connection', function(socket){
    console.log(cookieEmail);
    var time = new Date();
    
    var userObj = new Object();
    userObj['username'] = '';
    //userObj['msg'] = '';
    
    if (cookieEmail != null){
        user.findOne({email: cookieEmail}, function(err, result){
            if (err){
                conosle.err(err);   
            }
            else if(result != null){
                console.log(result.nameF + " " + result.nameL + " has connected");
                user.update({email: cookieEmail}, {online: true}).exec();
                userObj['username'] = cookieEmail;
                //userObj['msg'] = "";
                socket.emit('who', userObj);
            }   
        });
    }
    
    socket.on('disconnect', function(){
        user.findOne({email: cookieEmail}, function(err, result){
            if (err){
                conosle.err(err);   
            }
            else if(result != null){
                console.log(result.nameF + " " + result.nameL + " has disconnected");
                user.update({email: cookieEmail}, {online: false}).exec();
            }   
        });
    });
});

var chatio = io.of('/chat');
chatio.on('connection', function(socket){
    console.log(cookieEmail);
    socket.username = cookieEmail;
    console.log('su: ' + socket.username);
    var time = new Date();
    var roomJoined;
    
    // Object that contains vital info
    var userObj = new Object();
    userObj['username'] = '';
    userObj['name'] = '';
    userObj['msg'] = '';
    userObj['room'] = '';

    // Check room capacity
    for (var i = 0; i < chatRoom.length; i++){
        socket.join(chatRoom[i]);
        var member = chatio.adapter.rooms[chatRoom[i]];
        console.log(member);
        if (Object.keys(member).length > 2) {
            if (i == chatRoom.length - 1) {
                socket.leave(chatRoom[i]);
                var j = i + 1;
                var str = "room" + j;
                chatRoom.push(str);
            }
            else {
                socket.leave(chatRoom[i]);
            }
            
            
        }
        else {
            roomJoined = chatRoom[i];
            user.update({email: socket.username}, {room: roomJoined}).exec();
            socket.emit('roomNum', roomJoined);
            break;
        }
    }
    console.log(chatRoom);
    
    if (cookieEmail != null){
        user.findOne({email: socket.username}, function(err, result){
            if (err){
                conosle.err(err);   
            }
            else if(result != null){
                console.log(result.nameF + " " + result.nameL + " has connected");
                user.update({email: socket.username}, {online: true}).exec();
                userObj.room = roomJoined;
                userObj.name = result.nameF;
                userObj['username'] = result.nickname;
                userObj['msg'] = "";
                socket.emit('who', userObj);
                if ((Object.keys(member).length > 1)) {
                    chatio.in(roomJoined).emit('prep');
                }
                else {
                    chatio.in(roomJoined).emit('waiting');
                }
            }   
        });
    }
    
    socket.on('login', function(user){
         chatio.in(user.room).emit('login', user);
    });
    
    socket.on('disconnect', function(){
        user.findOne({email: socket.username}, function(err, result){
            if (err){
                conosle.err(err);   
            }
            else if(result != null){
                console.log(result.nameF + " " + result.nameL + " has disconnected");
                chatio.to(result.room).emit('dc', result.nickname);
                socket.leave(result.room);
                user.update({email: socket.username}, {online: false}).exec();
                user.update({email: socket.username}, {room: ""}).exec();
                console.log('dc: ' + socket.username);
            }   
        });
    });

    socket.on('chat message', function(msg){
        user.update({email: socket.username}, {online: true}).exec();
        console.log(msg.name + ': ' + msg.msg);
        userObj['username'] = msg.name;
        userObj['msg'] = msg.msg;
        chatio.in(roomJoined).emit('chat message', userObj);
    });
});

// What's gonna be on the screen
app.get('/', function(req, res){
    // Checking if session nameF exists
    // If yes, profile; if not, login page
    if (req.cookies.email) {
        res.redirect('/profile');
    }
    else {
        res.render('index');   
    }
    console.log(req.cookies.email);
});

//app.get('/login', function(req, res){
//    if (req.cookies.email){
//        res.redirect('/profile');   
//    }
//    else {
//        res.render('login');
//    }
//    console.log("/login " + req.cookies.email);
//});
//
//app.get('/signup', function(req, res){
//    if (req.cookies.email){
//        res.redirect('profile');   
//    }
//    else {
//        console.log("/signup " + req.cookies.email);
//        res.render('signup');   
//    }
//});

app.get('/profile', function(req, res){
    if (req.cookies.email) {
        cookieEmail = req.cookies.email;
        user.findOne({email: req.cookies.email}, function(err, search){
            if (err){
                console.err(err);   
            }
            else {
                if (search) {
                    console.log(cookieEmail);
                    user.update({email: cookieEmail}, {online: true}).exec();
                    var year = new Date();
                    age = year.getFullYear() - search.birthday;
                    res.render('profile', {name: search.nameF}); 
                }
                else {
                    res.redirect('/');   
                }
                
            }
        }); 
    }
    else {
        res.redirect('/');
    }
    console.log("/profile " + req.cookies.email);
});

app.get('/chat', function(req, res){
    if (req.cookies.email){
        cookieEmail = req.cookies.email;
        console.log('chat: ' + cookieEmail);
        res.render('chat');
    }
    else {
        res.redirect('/profile');   
    }
});

//app.get('/online', function(req, res){
//    if(req.cookies.email){
//        cookieEmail = req.cookies.email;
//        user.update({email: cookieEmail}, {online: true}).exec();
//        user.find({online: true}, function(err, result){
//            if (err){
//                console.error(err);   
//            }
//            else {
//                res.render('online', {onlineUsers: result});
//            }
//        });
//    }
//});

app.post('/loginCheck', function(req, res){
    console.log(req.body);
    user.findOne({email: req.body.email, password: req.body.pass}, function(err, search){
        if (err){
            console.error(err);
        }
        else {
            if (search == null){
                console.log("No Result Found"); 
                res.redirect('/');  
            }
            else {
                console.log("Logged as " + search);  
                res.cookie('email', req.body.email, {path: '/'});
                console.log("/logincheck " + req.cookies.email);
                res.redirect('/profile');
            }
        }
    });
});

app.get('/logoff', function(req, res){
    res.clearCookie('email', { path: '/' }); 
    console.log('/logoff ' + req.cookies.email);
    cookieEmail = "";
    res.redirect('/');
})

app.post('/registration', function(req, res){
    console.log(req.body); 
    var register = new user({
        nameF: req.body.nameF, 
        nameL: req.body.nameL,
        nickname: req.body.nickname,
        email: req.body.email,
        password: req.body.pass,
        birthday: 0,
        language_main: "English",
        point: 0,
        online: false,
        room: ""
    });
    try {
        register.save();
        res.redirect('/');
    }
    catch (err) {
        console.error(err);   
    }
});

app.get('/matching', function(req, res){
    cookieEmail = req.cookies.email;
    var obj = new Object();
    var randomNumber;
    if (req.cookies.email != null || req.cookies.email != undefined) {
        user.find({email: req.cookies.email}, function(err, result){
            if (err){
                console.err(err);   
            }
            else {
                console.log(randomNumber);
            }
        });   
        res.redirect('/chat');
    }
});


app.get('/user', function(req, res){
    user.find({}, function(err, users){
        if (err) {
            console.err(err);   
        }
        res.send(users);
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

server.listen(port, function(){
   console.log("server running"); 
});

//server.listen(8081, function(){
//   console.log("server running"); 
//});

module.exports = app;
